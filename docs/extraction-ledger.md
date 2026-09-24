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
| macOS ARM64 | `26.917.62051` / `10789` | 18 patches | Static stage, corrected supervised adoption, usable task, terminal, palette, sidebar, task messaging, wait roster, and TinRelay loopback green; early-readiness limitation remains |
| Windows 11 ARM64 | `26.915.31945` / `9922` | 16 patches | Signed-MSIX stage, genuine-task supervised adoption, renderer readiness, complete static registry/fleet probes, and an operator-observed patched surface green |
| Ubuntu DEB (`arm64`, `amd64`) | `26.915.31029` / `9771` | 16 patches | ARM64 authenticated static stage, installation, application opening, and renderer readiness green |
| Fedora RPM (`aarch64`, `x86_64`) | `26.911.61220` / `9647` | 16 patches | ARM64 static stage, genuine-task supervised adoption, renderer readiness, and build-9647 live feature evidence green |

This table and the root README are the only current-build summaries. A port is not complete until
both are updated in the same reviewed change. Platform runbooks retain exact hashes and boundaries:

- [macOS qualification](../qualification/macos.md)
- [Linux qualification](../qualification/linux.md)
- [Windows qualification](../qualification/windows.md)

## Current fleet evidence

| Area | Current evidence | Next useful boundary |
| --- | --- | --- |
| Desktop ASAR transforms | Complete selected fleets recognize pristine sources, apply in catalog order, pass syntax and focused probes, and reapply byte-identically on macOS build `10789`, Windows build `9922`, Ubuntu build `9771`, and Fedora build `9647` | Requalify only when a generated owner or selected fleet changes |
| Package integrity | macOS signature and ASAR seal green; Windows signed-MSIX reconstruction, re-extraction, native-payload preservation, and source stability green; Ubuntu DEB build `9771` and Fedora RPM build `9647` pass their separate authenticated package adapters | Requalify the affected package adapter when package layout or trust changes |
| Safe restart and rescue | Healthy supervised adoption returned to the exact originating task on macOS, Windows, and Fedora with no supervisor residue; current Ubuntu build `9771` passed direct installation, opening, and renderer readiness. macOS build `10789` also exposed an early-ready false positive on a living Oops screen | Repair and requalify the macOS usable-task readiness seam; do not infer living-Oops recovery from the current ready marker |
| Renderer identity and policy | Runtime roster, palette, model guard, task attention, reasoning retention, sidebar collapse, registry, and observability passed their current static gates; selected macOS and Windows live surfaces are green | Exercise only changed or still-open live surfaces |
| Task messaging | Current cross-task attribution, send receipt, wait roster, and TinRelay presentation transforms pass composed static probes for both Linux builds; macOS build `10789` and Linux build `9647` have live task-messaging evidence, while Windows retains its build-`9922` qualification | Requalify changed generated owners or platform transport seams |
| Renderer turn window | Current bounded selector and consumers pass deterministic probes on selected older platform fleets; macOS build `10789` uses vendor-owned turn pagination instead | The greater-than-200-turn live fixture remains deliberately unrun |
| Standalone-output compaction | Exact Codex `rust-v0.155.0-alpha.16.3` source patch and macOS build-`10789` binary integration pass focused source and package gates | Live-accept a task-message-triggered compaction boundary |

## Current macOS qualification

Codex Desktop `26.917.62051` (build `10789`) was staged from an official pristine application with
the current 18-patch macOS fleet on 2026-09-23. The selected transforms passed focused probes
before and after repacking, remained byte-identical on a second application, preserved the native
package tree, and produced a valid code signature and ASAR seal. The accepted and installed ASAR
SHA-256 is `391800e4d7703f58b79310aceb128462f54acff35cbc79284f2a02a02d979e36`. The integrated
Codex executable SHA-256 is `c7db82d0b0eb00ff5efc7275210a2e06b2b7281682c89a77b79bb087f77debf4`.

The final healthy supervisor incident
`2026-09-23T13-13-19-338Z-04ae4615-801a-432d-9fcc-a2def5198cc7` installed that candidate
at the canonical path, showed the preparation notification, observed the invoking CLI exit, and
returned to the originating task. Mike verified the usable task, configured terminal shortcut,
backgrounds and colors, menu bar, and sidebar collapse. Outgoing task names, linked wait-roster
names with corrected text baseline, and a TinRelay self-loop passed focused live checks.

The earlier incident `2026-09-23T10-00-40-797Z-1ad3769f-2546-4cea-ae48-c77263316fe5`
exposed a distinct supervisor defect: a patched component threw
`MTKuseSidebarArchivePolicy is not defined`, the primary app displayed Oops, but the renderer had
already emitted `renderer.ready` and the supervisor completed. That patch error was corrected
before final adoption. The early-ready criterion remains unfixed, so current macOS living-Oops
recovery is not qualified. A live greater-than-200-turn fixture and a task-message-triggered
compaction boundary remain explicit omissions.

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
  "safe-start-readiness",
  "renderer-patch-registry"
]
```

`standalone-output-compaction` integrates the separately built Codex
`rust-v0.155.0-alpha.16.3` repair at upstream commit
`ffa06df2317e3e65fc74da977a5884710c5382d5`. Private paths and user policy are intentionally
absent from this public record.

## Current Windows qualification

The Windows 11 ARM64 build-`9922` candidate uses the supported 16-patch subset. Candidate package
`OpenAI.Codex_26.915.4065.1_arm64__2p2nqsd0c76g0` has MSIX SHA-256
`2c3c18e5e46c76a2b30451a49ed7e5c6f8d4313c128242ce35dbf5d170843a53` and installed ASAR
SHA-256 `c220d47f138d733ac216a66a794607f43eb29702615aa1d4edf587db4126b0a9`. A genuine task-led
supervisor replacement reached renderer readiness, returned to the same task and model settings,
and left no supervisor residue. The complete selected fleet and registry passed composed static
probes, and the operator directly observed patched renderer surfaces after relaunch. The exact
package procedure and retained evidence boundary belong in
[Windows qualification](../qualification/windows.md).

## Current Linux qualification

Ubuntu DEB (`arm64` and `amd64`) and Fedora RPM (`aarch64` and `x86_64`) currently expose different
vendor builds. Ubuntu uses Desktop `26.915.31029` / build `9771`; Fedora remains on Desktop
`26.911.61220` / build `9647`. They share the 16 patch implementations but keep exact fail-closed
profiles for their different generated owners. The Ubuntu ARM64 build-9771 package passed
authenticated static reconstruction, installation, application opening, and renderer readiness.
Fedora ARM64 retains its qualified build-9647 RPM lifecycle and renderer evidence, and the existing
build-9647 live feature pass remains semantic evidence for that current profile rather than current
Ubuntu package evidence. [Linux qualification](../qualification/linux.md) owns the exact hashes,
receipts, and deliberately unrun gates.

## Extraction rule

A slice moves only when it has one portable owner, no personal path or identity data, a focused
probe, an explicit compatibility claim, and a failure mode that leaves the operator's working
application untouched. Until then, copying source is not adoption.
