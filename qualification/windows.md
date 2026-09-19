# Windows qualification

Windows qualification separates generated-code compatibility, signed MSIX construction, and a
live supervised replacement. A green static stage does not imply that the package was installed or
launched.

## Current ARM64 checkpoint

The current checkpoint is Windows 11 ARM64 with inner Desktop `26.915.31945`, Codex build `9922`,
and AppUserModelID `OpenAI.Codex_2p2nqsd0c76g0!App`. The supported Windows fleet contains 16 ASAR
transforms. The package has no owned surface for the macOS menu-title or native app-tools
authorization repairs, and the standalone-output repair requires separately built native and WSL
executables, so those three patches remain excluded rather than being forced through unrelated
owners.

The accepted candidate is
`OpenAI.Codex_26.915.4065.1_arm64__2p2nqsd0c76g0`, package SHA-256
`2c3c18e5e46c76a2b30451a49ed7e5c6f8d4313c128242ce35dbf5d170843a53`, and installed ASAR
SHA-256 `c220d47f138d733ac216a66a794607f43eb29702615aa1d4edf587db4126b0a9`. It retains the OpenAI
package family and publisher identity under a locally trusted qualification certificate; it does
not claim Store provenance.

The static gate verified exact source identity, pristine patch checks, catalog-order application,
changed targets, syntax, focused probes, byte-identical second application, native-ASAR payload
preservation, MakeAppx reconstruction, SignTool signatures, exact same-family package identities,
full re-extraction, whole-tree equality, post-pack probes, and final source reinspection. The lab
retains exactly one pristine package and the accepted candidate; failed, superseded, and temporary
rollback packages were removed after acceptance.

## Live supervisor receipt

The healthy replacement passed on the Windows 11 ARM64 guest on 2026-09-19. A genuine task started
`tmtk-restart`; the supervisor observed the invoking CLI exit, installed the signed candidate,
launched its exact package root in the logged-in desktop session, and reached renderer readiness.
The native progress notification was shown during candidate preparation. The deep link returned to
the same task, model, and effort. No invoking CLI, supervisor helper, rescue process,
toolkit-owned terminal, or `TMTK-*` scheduled task remained.

This remains same-inner-build adoption evidence. The current `stage-msix` command takes a pristine
candidate source and a separate installed, live-proven known-good source with the exact same inner
Desktop identity. It applies the current fleet only to the pristine source and preserves the
known-good payload for rollback while rebuilding both packages with monotonic outer versions and a
local signature. The deliberate broken application and repair-exhaustion fixture was not rerun
because this port changed only the best-effort progress notification inside the Windows lifecycle
adapter. The complete selected fleet and registry passed the composed static probes, and the
operator directly observed patched renderer surfaces after relaunch. Shared behavior was not
rerun on Windows; macOS owns the current shared build-`9922` semantic pass. The
greater-than-200-turn fixture remains deliberately unrun; the current checkpoint does not claim
that gate.

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
