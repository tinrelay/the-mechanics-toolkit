# Upgrading The Mechanic's Toolkit

TMTK `0.2.19` is source-only. Use an exact published toolkit revision and inspect the official
package's **inner** Codex Desktop version and build before staging. An outer MSIX, DEB, or RPM
version alone is not a generated-JavaScript compatibility claim. The
[current build matrix](docs/extraction-ledger.md#current-build-matrix) and platform runbooks own
the evidence; Git history holds older port instructions.

## 0.2.19

The macOS target is Desktop `26.1027.30824` / build `22943`, with bundled CLI
`0.166.0-alpha.5.1`. Apply `standalone-output-compaction-22943` to exact upstream commit
`f79b26ccbb3116b052544666a181012fb45dc49b`, then build with stable Rust `1.95.0` through
`bin/tmtk-build-codex` and its default LTO-off setting. Do not reuse an older binary.

This build moves the main process into split Webpack bootstrap chunks. Exact package/loader
ownership now selects the handler chunk; the readiness writer, native peer authorizer, terminal
catalogs, observability startup, and radio/receipt hooks follow their new owners. Renderer
profiles refresh the roster manager, title subscriptions, memo caches, archive guards, and
reasoning hooks. BAD MODEL uses the complete settings-loading state, including reserve-model
loading, before publishing a mismatch. Attribution, alignment, and radio scroll anchoring keep
their existing behavior.

Both focused tests failed on the exact stock CLI at their intended assertions, then passed with
the three-file repair. This independently revalidates the local and remote-v2 repair paths;
it is not a claim that every upstream replay symptom or alternate rollover path is fixed.
No experimental retention feature was enabled.

The complete 16-patch ASAR composition, behavior probes, and byte-identical reapplication passed.
The matching native release build and signed 18-patch package stage passed, including post-repack
probes, signatures/seal, and native payload preservation. Supervised adoption returned to a real
task with an editable composer and matching installed hashes. The roster loaded all 19 entries
without a diagnostic; task-message ACK/wait and two-way TinRelay passed. The
[macOS receipt](qualification/macos.md) records the exact gates and limits; this is a narrow
live smoke result, not a new full feature tour, live compaction test, or rescue-capability test.
Windows/Linux qualification boundaries and TinRelay transport/configuration are unchanged.

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

1. Preserve any local checkout changes; use an immutable `0.2.19` revision and install dependencies.
   Run `npm run check` and `npm test` before staging. Copy the relevant
   `examples/toolkit.<platform>.example.json` to ignored `toolkit.local.json`, replacing its
   fictional paths and retaining only still-applicable private policy.
2. Acquire one authenticated pristine package for the platform and architecture. Inspect its
   inner Desktop identity and select the exact supported profile. Stage one complete candidate
   with `stage-macos`, `stage-msix`, `stage-deb`, or `stage-rpm`; staging never installs or launches.
   Windows staging also requires a separately verified same-inner-build known-good source.
3. Adopt through the documented platform procedure after explicit operator confirmation. Verify a
   real task and editable composer, not only a renderer-ready marker: a previous macOS candidate
   reached that marker while displaying Codex's Oops screen. macOS build `22530` and Windows
   build `10954` have supervised task-return evidence; Ubuntu build `10954` has only
   direct-install/open evidence.
4. Retain compact receipts and hashes, one pristine package and one current candidate. Remove
   failed and superseded bulk, extracted trees, and transaction-only rollback copies after the
   replacement ends.

TMTK does not distribute vendor applications or patched binaries. See [usage](docs/usage.md),
[staging](docs/staging.md), and the [platform runbooks](qualification/) for exact commands and
residual boundaries.
