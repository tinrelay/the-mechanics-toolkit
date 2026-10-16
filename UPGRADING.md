# Upgrading The Mechanic's Toolkit

TMTK `0.2.12` is source-only. Use an exact published toolkit revision and inspect the official
package's **inner** Codex Desktop version and build before staging. An outer MSIX, DEB, or RPM
version alone is not a generated-JavaScript compatibility claim. The
[current build matrix](docs/extraction-ledger.md#current-build-matrix) and platform runbooks own
the evidence; Git history holds older port instructions.

## 0.2.12

The macOS target is Desktop `26.1013.31256` / build `20586`, with bundled CLI
`0.163.0-alpha.10.2`. Apply source-patch `standalone-output-compaction-20586` to exact upstream
commit `4ebc485ca321243727539187169425fcf972f2c4`, then use `bin/tmtk-build-codex` with stable
Rust `1.95.0` and its default LTO-off setting. Both focused standalone-input tests failed on
stock source and passed after repair. The experimental annotated-tool-output feature does not
cover ordinary unmarked standalone input and is not enabled by TMTK.

This port follows the new generated desktop owners and moved task-key exports. It preserves
native pending-input persistence, selected-model/locked-effort reporting, source-task naming,
incoming right alignment, outgoing left alignment, and runtime lifecycle protections. The
18-patch fleet passed signed staging, post-repack probes, native-payload preservation, and
byte-identical second application. The stable-Rust release build passed. A missing reactive-title
hook import in outgoing receipts was corrected with a causal regression probe. The final build
completed a healthy supervised restart and the operator returned to the real task, without rescue.
The model guard now follows the native settings-loading state: provisional selections stay
neutral, while a fully loaded mismatch warns immediately.
Windows and Linux targets and qualification boundaries are unchanged.

## Existing installations

Git history preserves earlier release instructions and package receipts. Do not apply an old
source diff to the current CLI or infer live acceptance from a previous build's receipt.

Remove `sidebar-action-collapse` from older private selections: Codex now owns that presentation.
`renderer-turn-window` also remains unselected on the macOS frontier. Configure opt-in dot
protection through the [runtime roster](patches/dot-lifecycle-protection/); it does not change
native dot appearance or model/reasoning behavior. No task-data migration is needed.

Staging removes the vendor signature from only the copied macOS candidate before mutating it,
then signs and verifies the finished bundle. The pristine source stays untouched. The supervisor
recognizes the nested `CodexCLI.app` and resumed terminal-client layouts. Normal adoption does
not requalify destructive rescue scenarios.

Windows/Ubuntu build `10954` and Fedora build `9647` keep their exact profiles and earlier
package/open evidence. Windows x64, DEB `amd64`, and RPM `x86_64` are supported code paths:
use an architecture-matched official package and pass exact-build staging/adoption. The absence
of an x86-family lab receipt is not a prohibition or permission to substitute ARM binaries.

## Operator path

1. Preserve any local checkout changes; use an immutable `0.2.12` revision and install dependencies.
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
