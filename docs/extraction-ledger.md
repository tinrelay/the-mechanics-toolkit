# Extraction ledger

This repository is the canonical source for the portable patches recorded below. This ledger owns
the current build matrix and fleet-wide qualification state. Patch READMEs own stable behavior,
boundaries, and focused verification; they link here instead of repeating fast-changing Desktop
versions or build numbers.

Git history preserves earlier ports and receipts. They are not active compatibility promises and
do not remain in current patch documentation merely as historical evidence.

## Current build matrix

| Platform | Qualified Desktop build | Fleet | State |
| --- | --- | --- | --- |
| macOS ARM64 | `26.911.61220` / `9647` | 19 patches | Static stage, supervised adoption, renderer readiness, task messaging, and TinRelay loopback green |
| Windows 11 ARM64 | `26.911.61220` / `9647` | 16 patches | Signed-MSIX stage, genuine-task supervised adoption, renderer readiness, registry, palette, observability, and selected messaging paths green |
| Ubuntu DEB (`arm64`, `amd64`) | `26.911.61220` / `9647` | 16 patches | ARM64 static stage, genuine-task supervised adoption, renderer readiness, and live feature runbook green |
| Fedora RPM (`aarch64`, `x86_64`) | `26.911.61220` / `9647` | 16 patches | ARM64 static stage, genuine-task supervised adoption, and renderer readiness green on the byte-identical Linux ASAR |

This table and the root README are the only current-build summaries. A port is not complete until
both are updated in the same reviewed change. Platform runbooks retain exact hashes and boundaries:

- [macOS qualification](../qualification/macos.md)
- [Linux qualification](../qualification/linux.md)
- [Windows qualification](../qualification/windows.md)

## Current fleet evidence

| Area | Current evidence | Next useful boundary |
| --- | --- | --- |
| Desktop ASAR transforms | Complete selected fleets recognize pristine sources, apply in catalog order, pass syntax and focused probes, and reapply byte-identically on macOS, Windows, Ubuntu, and Fedora build `9647` | Requalify only when a generated owner or selected fleet changes |
| Package integrity | macOS signature and ASAR seal green; Windows signed-MSIX reconstruction, re-extraction, native-payload preservation, and source stability green; Ubuntu DEB and Fedora RPM carry the same qualified ASAR through separate authenticated package adapters | Requalify the affected package adapter when package layout or trust changes |
| Safe restart and rescue | Healthy supervised adoption returned to the exact originating task on macOS, Windows, Ubuntu, and Fedora with no supervisor residue | Re-run controlled failure only when the lifecycle boundary changes |
| Renderer identity and policy | Runtime roster, palette, model guard, task attention, reasoning retention, sidebar collapse, registry, and observability passed their current static gates; selected macOS and Windows live surfaces are green | Exercise only changed or still-open live surfaces |
| Task messaging | Current cross-task attribution, send receipt, wait roster, and TinRelay presentation transforms pass composed static probes; macOS and Ubuntu task messaging and TinRelay presentation are live-green, as are selected Windows paths | Requalify changed generated owners or platform transport seams |
| Renderer turn window | Current bounded selector and consumers pass deterministic probes | The greater-than-200-turn live fixture remains deliberately unrun |
| Standalone-output compaction | Exact Codex `rust-v0.155.0-alpha.2.6` source patch and desktop binary integration pass focused source and package gates | Live-accept a task-message-triggered compaction boundary |

## Current macOS qualification

Codex Desktop `26.911.61220` (build `9647`) was staged from a pristine vendor application with the
current 19-patch fleet on 2026-09-17. The selected transforms passed their focused probes before and
after repacking, remained byte-identical on a second application, preserved the native package
tree, and produced a valid code signature and ASAR seal. The accepted ASAR SHA-256 is
`51fde579f5cc71183aa33b5b4da0ffcfaee60c93a2a64706a9d500f3e80635ee`; the integrated Codex
executable SHA-256 is `31957ea9d8245657c39ca92fdd353ae915c79d70d2b13e2c68fc0b921b4bd930`.

The supervisor installed that candidate at the canonical path, observed renderer readiness, and
returned to the originating task without an overlapping CLI writer. A normal task message and an
addressed TinRelay loopback completed afterward. The greater-than-200-turn live fixture remains an
explicitly accepted omission rather than an implied success.

The qualified macOS fleet contains:

```json
[
  "cross-task-attribution",
  "runtime-json-reload",
  "agent-roster",
  "task-visual-palette",
  "reasoning-retention",
  "model-identity-guard",
  "macos-menu-title",
  "standalone-output-compaction",
  "sidebar-action-collapse",
  "task-attention-policy",
  "terminal-toggle",
  "outgoing-message-receipt",
  "wait-thread-roster",
  "tinrelay-pointer-presentation",
  "native-app-tools-peer-authorization",
  "codex-observability",
  "renderer-turn-window",
  "safe-start-readiness",
  "renderer-patch-registry"
]
```

`standalone-output-compaction` integrates the separately built Codex
`rust-v0.155.0-alpha.2.6` repair. Private paths and user policy are intentionally absent from this
public record.

## Current Windows qualification

The Windows 11 ARM64 build-`9647` candidate uses the supported 16-patch subset. Candidate package
`OpenAI.Codex_26.911.7940.7_arm64__2p2nqsd0c76g0` has MSIX SHA-256
`8ebf41808920a408e9f831ed8e4d9f0e6b4cf5666681abe084de9ddf2500d43b` and installed ASAR
SHA-256 `d4533d56ded97c1b11f28835775dc3467128c300d148c4da3cb815b4d5c8db17`. A genuine task-led
supervisor replacement reached renderer readiness, returned to the same task and model settings,
and left no supervisor residue. The exact package procedure and retained evidence boundary belong
in [Windows qualification](../qualification/windows.md).

## Current Linux qualification

Ubuntu DEB (`arm64` and `amd64`) and Fedora RPM (`aarch64` and `x86_64`) are the current Linux
build-`9647` targets. Their qualified vendor packages use the same 16-patch fleet and contain the
same patched ASAR; no CPU- or distribution-specific JavaScript profile is baked into the port.
Both ARM64 package adapters passed static reconstruction and genuine-task supervised adoption.
Ubuntu supplied the live renderer-feature pass for the shared ASAR, while Fedora separately proved
the RPM lifecycle boundary. [Linux qualification](../qualification/linux.md) owns the exact hashes,
receipts, and deliberately unrun gates.

## Extraction rule

A slice moves only when it has one portable owner, no personal path or identity data, a focused
probe, an explicit compatibility claim, and a failure mode that leaves the operator's working
application untouched. Until then, copying source is not adoption.
