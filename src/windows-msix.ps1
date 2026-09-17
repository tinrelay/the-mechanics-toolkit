param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$Action,

  [Parameter(Position = 1, ValueFromRemainingArguments = $true)]
  [string[]]$ActionArguments
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$PackageName = "OpenAI.Codex"
$PackageFamily = "OpenAI.Codex_2p2nqsd0c76g0"
$Publisher = "CN=50BDFD77-8903-4850-9FFE-6E8522F64D5B"
$ApplicationId = "OpenAI.Codex_2p2nqsd0c76g0!App"

function Write-Json($Value) {
  [Console]::Out.WriteLine(($Value | ConvertTo-Json -Compress -Depth 6))
}

function Require-Arguments([int]$Count) {
  $supplied = @($ActionArguments | Where-Object { $null -ne $_ -and $_ -ne "" })
  if ($supplied.Count -ne $Count) { throw "$Action requires exactly $Count argument(s)" }
}

function Require-Directory([string]$Value, [string]$Label) {
  if (-not (Test-Path -LiteralPath $Value -PathType Container)) { throw "missing ${Label}: $Value" }
  return [IO.Path]::GetFullPath($Value).TrimEnd("\")
}

function Require-File([string]$Value, [string]$Label) {
  if (-not (Test-Path -LiteralPath $Value -PathType Leaf)) { throw "missing ${Label}: $Value" }
  return [IO.Path]::GetFullPath($Value)
}

function Get-ManifestIdentity([string]$ContentRoot) {
  $manifestPath = Join-Path $ContentRoot "AppxManifest.xml"
  [xml]$manifest = Get-Content -LiteralPath $manifestPath
  $identity = $manifest.Package.Identity
  if ($null -eq $identity -or
      $identity.GetAttribute("Name") -cne $PackageName -or
      $identity.GetAttribute("Publisher") -cne $Publisher -or
      $identity.GetAttribute("Version") -notmatch "^\d+(?:\.\d+){3}$" -or
      $identity.GetAttribute("ProcessorArchitecture") -notmatch "^(?i:arm64|x64|x86|neutral)$" -or
      $identity.GetAttribute("ResourceId") -notmatch "^[A-Za-z0-9.-]*$") {
    throw "manifest does not have the exact qualified OpenAI Codex identity"
  }
  $applications = @($manifest.Package.Applications.Application | Where-Object {
    [String]::Equals([string]$_.Id, "App", [StringComparison]::Ordinal) -and
      [String]::Equals(([string]$_.Executable).Replace("/", "\"), "app\ChatGPT.exe",
        [StringComparison]::OrdinalIgnoreCase) -and
      [String]::Equals([string]$_.EntryPoint, "Windows.FullTrustApplication",
        [StringComparison]::OrdinalIgnoreCase)
  })
  if ($applications.Count -ne 1) {
    throw "manifest has no unique exact Codex full-trust application"
  }
  return [ordered]@{
    name = $identity.GetAttribute("Name")
    publisher = $identity.GetAttribute("Publisher")
    version = $identity.GetAttribute("Version")
    architecture = $identity.GetAttribute("ProcessorArchitecture").ToLowerInvariant()
    resourceId = $identity.GetAttribute("ResourceId")
    applicationId = $ApplicationId
  }
}

function Get-SigningCertificate([string]$Thumbprint) {
  $normalized = $Thumbprint.Replace(" ", "").ToUpperInvariant()
  if ($normalized -notmatch "^[0-9A-F]{40}$") { throw "signing certificate thumbprint is invalid" }
  $matches = @(Get-ChildItem Cert:\CurrentUser\My | Where-Object { $_.Thumbprint -ceq $normalized })
  if ($matches.Count -ne 1) { throw "exact CurrentUser signing certificate was not found" }
  $certificate = $matches[0]
  if (-not $certificate.HasPrivateKey -or $certificate.Subject -cne $Publisher -or
      $certificate.NotBefore.ToUniversalTime() -gt [DateTime]::UtcNow -or
      $certificate.NotAfter.ToUniversalTime() -le [DateTime]::UtcNow -or
      -not @($certificate.EnhancedKeyUsageList | Where-Object {
        [string]$_.ObjectId -eq "1.3.6.1.5.5.7.3.3"
      })) {
    throw "signing certificate is not a current code-signing certificate for the exact package publisher"
  }
  return $certificate
}

function Get-ValidSignedTool([string]$Value, [string]$Label) {
  $file = Require-File $Value $Label
  $signature = Get-AuthenticodeSignature -LiteralPath $file
  if ($signature.Status.ToString() -ne "Valid" -or $null -eq $signature.SignerCertificate) {
    throw "$Label does not have a valid Authenticode signature"
  }
  return [ordered]@{
    path = $file
    sha256 = (Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash.ToLowerInvariant()
    signer = $signature.SignerCertificate.Subject
  }
}

function Remove-GeneratedPackageFiles([string]$ContentRoot) {
  foreach ($relative in @(
    "AppxBlockMap.xml",
    "AppxSignature.p7x",
    "AppxMetadata",
    "microsoft.system.package.metadata"
  )) {
    Remove-Item -LiteralPath (Join-Path $ContentRoot $relative) -Recurse -Force -ErrorAction SilentlyContinue
  }
}

function Get-NormalizedManifest([string]$Path, [string]$Version) {
  [xml]$manifest = Get-Content -LiteralPath $Path
  $manifest.PreserveWhitespace = $false
  $manifest.Package.Identity.Version = $Version
  return $manifest.OuterXml
}

function Get-TextSha256([string]$Value) {
  $sha256 = [Security.Cryptography.SHA256]::Create()
  try {
    $hash = $sha256.ComputeHash([Text.Encoding]::UTF8.GetBytes($Value))
    return [BitConverter]::ToString($hash).Replace("-", "").ToLowerInvariant()
  } finally {
    $sha256.Dispose()
  }
}

function Invoke-MakeAppx(
  [string]$Executable,
  [string[]]$Arguments,
  [string]$Label
) {
  $output = @(& $Executable @Arguments 2>&1 | ForEach-Object { $_.ToString() })
  $exitCode = $LASTEXITCODE
  if ($exitCode -eq 0) { return }
  $tail = ($output | Select-Object -Last 16) -join [Environment]::NewLine
  $tail = [Regex]::Replace($tail, "[\x00-\x08\x0B\x0C\x0E-\x1F]", "")
  if ($tail.Length -gt 4096) { $tail = $tail.Substring($tail.Length - 4096) }
  $detail = if ($tail) { "`n$tail" } else { "" }
  throw "MakeAppx $Label failed: $exitCode$detail"
}

function Copy-PackageContent([string]$SourceRoot, [string]$Destination, [string]$Version) {
  $source = Require-Directory $SourceRoot "source package directory"
  $destinationRoot = [IO.Path]::GetFullPath($Destination).TrimEnd("\")
  if (Test-Path -LiteralPath $destinationRoot) { throw "package workspace already exists: $destinationRoot" }
  $parent = Split-Path -Parent $destinationRoot
  $null = Require-Directory $parent "package workspace parent"
  $null = New-Item -ItemType Directory -Path $destinationRoot
  try {
    $sourceManifestPath = Join-Path $source "AppxManifest.xml"
    $expectedManifest = Get-NormalizedManifest $sourceManifestPath $Version
    $null = & robocopy.exe $source $destinationRoot /E /COPY:DAT /DCOPY:DAT /R:1 /W:1 /NFL /NDL /NJH /NJS /NP
    if ($LASTEXITCODE -gt 7) { throw "package copy failed: $LASTEXITCODE" }
    $null = & attrib.exe -R (Join-Path $destinationRoot "*") /S /D
    if ($LASTEXITCODE -ne 0) { throw "could not make copied package content writable: $LASTEXITCODE" }
    Remove-GeneratedPackageFiles $destinationRoot
    $manifestPath = Join-Path $destinationRoot "AppxManifest.xml"
    $before = Get-ManifestIdentity $destinationRoot
    if ($Version -notmatch "^\d+(?:\.\d+){3}$") { throw "replacement package version is invalid" }
    [xml]$manifest = Get-Content -LiteralPath $manifestPath
    $manifest.Package.Identity.Version = $Version
    $manifest.Save($manifestPath)
    $copiedManifest = Get-NormalizedManifest $manifestPath $Version
    if ($copiedManifest -cne $expectedManifest) {
      throw "package copy changed AppxManifest.xml beyond Identity.Version"
    }
    $after = Get-ManifestIdentity $destinationRoot
    if ($after.version -cne $Version) { throw "manifest version replacement did not verify" }
    return [ordered]@{
      sourceVersion = $before.version
      content = $destinationRoot
      manifest = $after
      manifestPreserved = $true
      normalizedManifestSha256 = Get-TextSha256 $copiedManifest
    }
  } catch {
    Remove-Item -LiteralPath $destinationRoot -Recurse -Force -ErrorAction SilentlyContinue
    throw
  }
}

function Build-SignedPackage(
  [string]$ContentRoot,
  [string]$Output,
  [string]$MakeAppx,
  [string]$SignTool,
  [string]$Thumbprint
) {
  $content = Require-Directory $ContentRoot "package content directory"
  $outputPath = [IO.Path]::GetFullPath($Output)
  if (Test-Path -LiteralPath $outputPath) { throw "package output already exists: $outputPath" }
  $null = Require-Directory (Split-Path -Parent $outputPath) "package output parent"
  $makeAppxPath = Require-File $MakeAppx "MakeAppx"
  $signToolPath = Require-File $SignTool "SignTool"
  $certificate = Get-SigningCertificate $Thumbprint
  $manifest = Get-ManifestIdentity $content
  try {
    Invoke-MakeAppx $makeAppxPath @("pack", "/h", "SHA256", "/d", $content, "/p", $outputPath) `
      "pack"
    & $signToolPath sign /fd SHA256 /sha1 $certificate.Thumbprint $outputPath | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "SignTool sign failed: $LASTEXITCODE" }
    & $signToolPath verify /pa /all $outputPath | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "SignTool verify failed: $LASTEXITCODE" }
    $signature = Get-AuthenticodeSignature -LiteralPath $outputPath
    if ($signature.Status.ToString() -ne "Valid" -or
        $signature.SignerCertificate.Subject -cne $Publisher -or
        $signature.SignerCertificate.Thumbprint -cne $certificate.Thumbprint) {
      throw "signed MSIX does not verify with the configured package certificate"
    }
    return [ordered]@{
      path = $outputPath
      sha256 = (Get-FileHash -LiteralPath $outputPath -Algorithm SHA256).Hash.ToLowerInvariant()
      signature = $signature.Status.ToString()
      signerSubject = $signature.SignerCertificate.Subject
      signerThumbprint = $signature.SignerCertificate.Thumbprint.ToLowerInvariant()
      manifest = $manifest
    }
  } catch {
    Remove-Item -LiteralPath $outputPath -Force -ErrorAction SilentlyContinue
    throw
  }
}

function Extract-Package(
  [string]$Package,
  [string]$Destination,
  [string]$MakeAppx
) {
  $packagePath = Require-File $Package "MSIX package"
  $makeAppxPath = Require-File $MakeAppx "MakeAppx"
  $destinationRoot = [IO.Path]::GetFullPath($Destination).TrimEnd("\")
  if (Test-Path -LiteralPath $destinationRoot) { throw "package extraction already exists: $destinationRoot" }
  $null = Require-Directory (Split-Path -Parent $destinationRoot) "package extraction parent"
  $signature = Get-AuthenticodeSignature -LiteralPath $packagePath
  if ($signature.Status.ToString() -ne "Valid" -or
      $null -eq $signature.SignerCertificate -or
      $signature.SignerCertificate.Subject -cne $Publisher) {
    throw "MSIX package does not have a valid signature for the exact package publisher"
  }
  try {
    Invoke-MakeAppx $makeAppxPath @("unpack", "/p", $packagePath, "/d", $destinationRoot) `
      "unpack"
    Remove-GeneratedPackageFiles $destinationRoot
    $manifest = Get-ManifestIdentity $destinationRoot
    return [ordered]@{content = $destinationRoot; manifest = $manifest}
  } catch {
    Remove-Item -LiteralPath $destinationRoot -Recurse -Force -ErrorAction SilentlyContinue
    throw
  }
}

switch ($Action) {
  "validate-tools" {
    Require-Arguments 3
    $makeAppx = Get-ValidSignedTool $ActionArguments[0] "MakeAppx"
    $signTool = Get-ValidSignedTool $ActionArguments[1] "SignTool"
    $certificate = Get-SigningCertificate $ActionArguments[2]
    Write-Json ([ordered]@{
      makeAppx = $makeAppx
      signTool = $signTool
      certificate = [ordered]@{
        thumbprint = $certificate.Thumbprint.ToLowerInvariant()
        subject = $certificate.Subject
        notAfter = $certificate.NotAfter.ToUniversalTime().ToString("o")
        trustedPeopleStores = @(
          "Cert:\CurrentUser\TrustedPeople",
          "Cert:\LocalMachine\TrustedPeople"
        ) | Where-Object {
          @(Get-ChildItem $_ | Where-Object {
            $_.Thumbprint -ceq $certificate.Thumbprint
          }).Count -eq 1
        }
      }
    })
  }
  "copy-package-content" {
    Require-Arguments 3
    Write-Json (Copy-PackageContent $ActionArguments[0] $ActionArguments[1] $ActionArguments[2])
  }
  "build-package" {
    Require-Arguments 5
    Write-Json (Build-SignedPackage $ActionArguments[0] $ActionArguments[1] $ActionArguments[2] `
      $ActionArguments[3] $ActionArguments[4])
  }
  "extract-package" {
    Require-Arguments 3
    Write-Json (Extract-Package $ActionArguments[0] $ActionArguments[1] $ActionArguments[2])
  }
  default { throw "unknown Windows package-staging helper action: $Action" }
}
