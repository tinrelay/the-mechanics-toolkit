# Upgrading The Mechanic's Toolkit

TMTK `0.2.7` is source-only. Use an exact published toolkit revision and inspect the official
package's **inner** Codex Desktop version and build before staging. An outer MSIX, DEB, or RPM
version alone is not a generated-JavaScript compatibility claim. The
[current build matrix](docs/extraction-ledger.md#current-build-matrix) and platform runbooks own
the evidence; Git history holds older port instructions.

## 0.2.7

The official macOS ARM64 Desktop `26.928.20755` / build `12246` is the accepted macOS target.
Its 18-patch fleet passed signed staging and supervised adoption into a usable task. Its bundled
CLI is `0.159.0`; the matching standalone-output repair is
`standalone-output-compaction-12246` on upstream commit
`687a119f0fcaace47e1f1abcc77cec6c813fd6da`. The release binary built with stable Rust
`1.95.0` and LTO off without the older query-depth source patch. Renderer owner fixes cover
current turn rendering, outgoing alignment, and the room-colored bottom fade. The previously
qualified Windows/Ubuntu `10954` and Fedora `9647` targets remain unchanged; this release does
not claim a fresh secondary-platform package run.

The current macOS example additionally selects `dot-lifecycle-protection` for build `12246`.
Configure cloud identity and deletion/reboot opt-ins in the runtime roster as described in the
[patch guide](patches/dot-lifecycle-protection/). Native dot appearance and model/reasoning behavior
are untouched. Signed composed probes and live policy predicates passed; qualification did not
delete or reboot a real dot. These guards protect the patched desktop paths, not other clients
or service-side actions. Omit this new patch when staging earlier builds.

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

1. Preserve any local checkout changes; use an immutable `0.2.7` revision and install dependencies.
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
