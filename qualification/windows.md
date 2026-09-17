# Windows qualification

Windows qualification separates generated-code compatibility, signed MSIX construction, and a
live supervised replacement. A green static stage does not imply that the package was installed or
launched.

## Current ARM64 checkpoint

The current checkpoint uses Windows 11 Pro ARM64 25H2, OS build `26200.8037`, and pristine outer
package version `26.908.9136.20`. The inner application is Desktop `26.908.70816`, Codex build
`9275`, Electron `42.3.0`. The AppUserModelID is `OpenAI.Codex_2p2nqsd0c76g0!App`.

The pristine package SHA-256 is
`4996d7ea61b7814dc8726a7c3d485656195481053cffbfbed844b3b895ef7a29`; its ASAR SHA-256 is
`7fcd1e231fca11d50431871cb6577255830c964b6d9f3aaeb8e524d0a29e3ddc`. Direct PE-resource
inspection found no `Integrity` / `ElectronAsar` resource in `ChatGPT.exe`; the signed MSIX block
map is therefore the package's ASAR integrity boundary for this build.

The supported Windows fleet contains 16 ASAR transforms. The package has no owned surface for the
macOS menu-title or native app-tools authorization repairs, and the standalone-output repair needs
separately built replacement executables, so those three patches remain excluded rather than being
forced through unrelated owners. The selected fleet's agent-roster transform recognized and
applied its exact build-9275 generated owner; no Windows-only roster semantics were introduced. The
accepted candidate has outer package version `26.908.9136.25`, package SHA-256
`3a5137dadc7fa112c26fb657064755e3fc4336894ca498c5a00b696fea16e18b`, and installed ASAR SHA-256
`0c2071da0df87ac663f860ce145270f56b591a12269d8693a37cb184165ae405`. It retains the OpenAI
package family and publisher identity under a locally trusted qualification certificate; it does
not claim Store provenance.

The static gate verified exact source identity, pristine patch checks, catalog-order application,
changed targets, syntax, focused probes, byte-identical second application, native-ASAR payload
preservation, MakeAppx reconstruction, SignTool signatures, exact same-family package identities,
full re-extraction, whole-tree equality, post-pack probes, and a final source reinspection. The lab
retains exactly the pristine `.20` package and accepted `.25` candidate, plus receipts and state
JSON. Superseded candidate and rollback packages were removed after acceptance.

## Live supervisor receipt

The ordinary healthy replacement passed on the same Windows 11 ARM64 guest on 2026-09-17. A
genuine GPT-5.6 Luna task at low reasoning started `tmtk-restart` from the pristine `.20` package.
After the branded native WPF consent choice, incident
`2026-09-17T07-28-36-815Z-cd77645e-0754-404f-8f50-3756cc02d677` recorded the exact invoking CLI
exit, installed the signed `.25` candidate, launched its exact package root in the logged-in desktop
session, and reached renderer readiness. The deep link returned to the same task, model, and effort.
No invoking CLI, supervisor helper, rescue process, toolkit-owned terminal, or `TMTK-*` scheduled
task remained.

This remains same-inner-build adoption evidence. The current `stage-msix` command takes a pristine
candidate source and a separate installed, live-proven known-good source with the exact same inner
Desktop identity. It applies the current fleet only to the pristine source and preserves the
known-good payload for rollback while rebuilding both packages with monotonic outer versions and a
local signature. The deliberate broken application and repair-exhaustion fixture was not rerun
because this port did not change the Windows lifecycle boundary.

## TinRelay presentation

The reviewed bridge-only binary, SHA-256
`661d0affb64c4db9ed3afb3c5c572d95b1f1ced9f577a57256bbad4ce1a57c41`, remained healthy with
one owned wait child; the collector also remained healthy. The accepted candidate remounted an
existing exact eight-key incoming delivery. A fresh nine-key `tinrelay-message-delivery-v1`
loopback with `received_at: 1789630916` then rendered the incoming and outgoing route, body,
timestamp, and Copy action without switching the visible task, and survived remount.

Live Codex supplied native `sentAtMs`, so native-time precedence was observed directly. The
reviewed causal fixture separately proves that a missing native time falls back to validated
TinRelay receipt seconds. The greater-than-200-turn live fixture was intentionally skipped; this
checkpoint does not claim fresh `.25` evidence for gates that were not rerun.

The prior build-8881 controlled-failure receipt remains valid historical capability evidence. On
2026-09-12 a deliberately broken candidate exhausted three bounded automatic repair turns, each
with an exact Stop and terminal-closure receipt, then **Restore Known-Working** installed the
separately preserved recovery package, returned to the original task, and left no toolkit process
or terminal residue. That receipt does not substitute for current-build static or healthy-path
qualification.

## Staging

Start from [`../toolkit.windows.example.json`](../toolkit.windows.example.json), replacing every
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
