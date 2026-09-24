# Windows qualification

Windows qualification separates generated-code compatibility, signed MSIX construction, and a
live supervised replacement. A green static stage does not imply that the package was installed or
launched.

## Current build and architecture boundary

The official ARM64 MSIX outer version `26.917.9434.0` contains Desktop `26.917.71314` / build
`10954`. Its authenticated pristine package SHA-256 is
`d008b18a325a0fa4341b85c665cca404305a7e9889e6293730bdca06ff6e4897`; its ASAR SHA-256 is
`5968711c1736d4a6be7ded6fdcc0a285a0cf101a2ec1e097e76512beb93cb217`. The ASAR differs
from macOS: exact Windows generated-owner recognition and composed package probes are proved here;
the shared JavaScript behavior inherits the macOS build-`10954` qualification.

The accepted Windows 11 ARM64 candidate is
`OpenAI.Codex_26.917.9434.1_arm64__2p2nqsd0c76g0`, locally signed MSIX SHA-256
`b0a86512cbf209d7fc536aba6ae82c28ad161e6b3e9eb3293703b94be46fa632`, installed ASAR
SHA-256 `d728c518934a4888d267354ad9fb261c14ea653459a318df435b882fab9c8b93`. It retains
the package family and publisher identity under a locally trusted qualification certificate; it
does not claim Store signature or provenance after rebuilding.

The 16 selected patches passed authenticated source inspection, catalog-order application,
post-repack probes, byte-identical second application, native-payload preservation, signed MSIX
reconstruction and re-extraction, and source reinspection. Fifteen applied; renderer-turn-window
was verified `upstream-owned` and left unchanged. The official pristine build was installed first
and opened a real task, supplying a same-inner-build live-proven known-good source. A genuine Alice
task then ran `tmtk-restart`; the supervisor installed the signed candidate and returned to that
same usable task with roster and palette visible. No feature-by-feature Windows tour was run. The
temporary rollback was removed after readiness; the lab retains one pristine and one candidate
MSIX. The greater-than-200-turn live fixture remains unrun.

The Windows package, staging, supervisor, and launch code accept **x64 and ARM64** package
identities. An official x64 MSIX exists at the same outer version, but its inner build, complete
stage, and live launch were not checked. This is an evidence boundary, not an ARM64-only product
restriction: an installing agent can inspect the exact x64 package and use the same fail-closed
stage and adoption gates. The package has no Windows owner for macOS menu-title or native
app-tools authorization. Standalone-output repair requires separate same-version native and WSL
executables and is not part of the 16-patch Windows fleet.

## Staging

Start from [`toolkit.windows.example.json`](../examples/toolkit.windows.example.json), replacing every
placeholder with the exact local qualification value. Run staging on Windows with absolute paths to
the pristine candidate source, installed known-good source, output MSIX files, toolkit config,
MakeAppx, SignTool, and a trusted code-signing certificate. The package versions in the config must
be four-part MSIX versions newer than both sources; the known-good version must also be newer than
the candidate.

```powershell
node bin/toolkit.mjs stage-msix `
  $PristineCandidateSource `
  $InstalledKnownGoodSource `
  $CandidateMsix `
  $KnownGoodMsix `
  --config $ToolkitConfig
```

This is a local qualification and adoption route, not a distributable OpenAI update. TMTK retains
the official package family and publisher identity while signing the rebuilt packages with an
explicitly trusted qualification certificate. It does not claim Microsoft Store provenance.

The standalone-output source repair is not part of this ASAR checkpoint. The official Windows
package contains both native `app/resources/codex.exe` and WSL `app/resources/codex`; selecting
that repair requires separately built, same-version replacements for both files. The Windows
stager rejects a partial replacement set.

## Live supervised replacement

The live gate must be initiated by a real Codex task whose environment and local task database
provide its exact task ID, project directory, model, and reasoning effort:

```powershell
node bin/tmtk-restart `
  --candidate $CandidateMsix `
  --known-good $KnownGoodMsix `
  -- $InstalledPackageRoot
```

Record the branded native consent choice, exact Desktop and invoking-CLI shutdown, writable Codex
state databases, installed package identity and hashes, exact AUMID activation, renderer-readiness
marker, restored task context, and final visible application state. A failure must preserve the
incident state and either enter the owned PowerShell rescue line or restore the independently
verified higher-version known-good package. Never weaken identity, version, signing, or readiness
checks merely to make adoption proceed.

## Qualification-only UI Automation

[`windows/ui-snapshot.ps1`](windows/ui-snapshot.ps1),
[`windows/ui-automation.ps1`](windows/ui-automation.ps1), and
[`windows/run-ui-automation.ps1`](windows/run-ui-automation.ps1) use Windows UI Automation to
inspect or invoke one exact control under an exact PID, window, and optional document. They are
test-laboratory helpers, not runtime dependencies. They do not scan by broad process name and their
receipts record text length and SHA-256 rather than prompt contents.
