# Upgrading The Mechanic's Toolkit

TMTK `0.2.10` is source-only. Use an exact published toolkit revision and inspect the official
package's **inner** Codex Desktop version and build before staging. An outer MSIX, DEB, or RPM
version alone is not a generated-JavaScript compatibility claim. The
[current build matrix](docs/extraction-ledger.md#current-build-matrix) and platform runbooks own
the evidence; Git history holds older port instructions.

## 0.2.10

The macOS frontier is official Desktop `26.1007.21159` / build `20052`. Its 18-patch fleet
passed signed static qualification, but its first adoption exposed a reasoning-thread React
binding error on chat mount. The corrected hook now has causal red/green coverage and an exact
stock-runtime check; corrected signed staging passed. Live chat acceptance is pending and the
last accepted build is `12947`. The next chat check exposed a false model warning caused by
publishing the available-model list instead of the effective selection. The corrected profile
has causal selection/locked-effort coverage and passed signed restaging; the live warning check
is pending.
Generated-owner
profiles follow the new Rolldown bundle without changing incoming right alignment, outgoing left
alignment, task/project naming, or opt-in lifecycle policy. Readiness follows the stock bootstrap
marker writer. Initial build `20052` reached renderer readiness but is not live-accepted.

The stock sidebar now carries archive-group metadata and supplies bulk-menu scope directly.
Protection resolves the selected conversations, not the viewer's group, and roster reloads
invalidate mounted archive actions. Focused probes cover these new owner shapes and palette
memo allocation. The complete fleet passed probes after signed repack and byte-identical second
application, with signature/seal and native-payload checks green. Live task rendering and policy
behavior still require the operator's restart.

The bundled CLI is `0.162.0-alpha.17.2`. Apply `standalone-output-compaction-20052` to exact
upstream commit `740e5af33c71225640e0c1c1555c514c2c93ab74`, then build with stable Rust `1.95.0`
and LTO off. Both standalone-input retention/context-ordering tests failed before repair and
passed afterward; the release build succeeded. No query-depth patch or bootstrap flags are needed.
Use the documented LTO-off
setting for focused release tests too, so they reuse build inputs instead of relinking with
Thin LTO. `renderer-turn-window` and the retired sidebar-collapse patch remain unselected.

macOS restart also recognizes an exact resumed terminal client when tools run through the shared
App Server rather than beneath that CLI. It matches the same-user bundled executable and task ID,
rejects ambiguity, and waits for the interactive CLI to exit before relaunching Desktop.

Windows/Ubuntu build `10954` and Fedora build `9647` retain their existing profiles and
receipts; this frontier does not claim a new secondary-platform package run. Configure dot lifecycle
protection through the runtime roster as described in the [patch guide](patches/dot-lifecycle-protection/);
native appearance and model behavior remain untouched.

## 0.2.6

For macOS build `11645`, use the corrected 17-patch example: `renderer-turn-window` is not selected
or qualified on that build. Remove it from any existing private selection before staging. Staging
now removes the vendor signature from only the copied candidate before changing its plist or ASAR,
then signs and verifies the finished candidate. The pristine source remains untouched. This fixes
non-live staging on a second Mac; it does not claim a new live adoption there.

## 0.2.5

This release qualified macOS Desktop `26.924.22138` / build `11645`. Its 17 selected
patches passed signed staging, post-repack probes, native-payload preservation, and byte-identical
second application. A genuine supervised replacement returned to a usable task; a TinRelay
self-loop rendered after adoption. The bundled CLI is `0.158.0-alpha.2.1`. Apply the exact
`standalone-output-compaction-11645` and `chatgpt-query-depth-11645` source patches to commit
`0d9c7cbfa6cf1489f55a8a9542b75ddd2c061807` before building a replacement CLI. The macOS
supervisor recognizes its current nested `CodexCLI.app` executable layout as well as the older
layout.

The sidebar-action-collapse patch is retired: current Codex puts those actions in a vertical rail.
Remove it from an existing private patch selection before staging. No task-data migration is
needed. Windows and Ubuntu build `10954` and Fedora build `9647` retain their exact generated-owner
profiles; their recorded package/live receipts predate this removal. Each installing agent must
pass the current selected-fleet stage and normal adoption gate for its official package. This
release does not claim a fresh Windows or Linux package run.

The package adapters also accept Windows x64, Ubuntu `amd64`, and Fedora `x86_64`. These paths
need an architecture-matched official package and exact-build staging. The absence of an
x86-family lab receipt is an evidence boundary, not a code restriction.

## Operator path

1. Preserve any local checkout changes; use an immutable `0.2.10` revision and install dependencies.
   Run `npm run check` and `npm test` before staging. Copy the relevant
   `examples/toolkit.<platform>.example.json` to ignored `toolkit.local.json`, replacing its
   fictional paths and retaining only still-applicable private policy.
2. Acquire one authenticated pristine package for the platform and architecture. Inspect its
   inner Desktop identity and select the exact supported profile. Stage one complete candidate
   with `stage-macos`, `stage-msix`, `stage-deb`, or `stage-rpm`; staging never installs or launches.
   Windows staging also requires a separately verified same-inner-build known-good source.
3. Adopt through the documented platform procedure after explicit operator confirmation. Verify a
   real task and editable composer, not only a renderer-ready marker: a previous macOS candidate
   reached that marker while displaying Codex's Oops screen. macOS build `12246` and Windows
   build `10954` have supervised task-return evidence; Ubuntu build `10954` has only
   direct-install/open evidence.
4. Retain compact receipts and hashes, one pristine package and one current candidate. Remove
   failed and superseded bulk, extracted trees, and transaction-only rollback copies after the
   replacement ends.

TMTK does not distribute vendor applications or patched binaries. See [usage](docs/usage.md),
[staging](docs/staging.md), and the [platform runbooks](qualification/) for exact commands and
residual boundaries.
