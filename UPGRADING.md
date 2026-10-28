# Upgrading The Mechanic's Toolkit

TMTK `0.2.18` is source-only. Use an exact published toolkit revision and inspect the official
package's **inner** Codex Desktop version and build before staging. An outer MSIX, DEB, or RPM
version alone is not a generated-JavaScript compatibility claim. The
[current build matrix](docs/extraction-ledger.md#current-build-matrix) and platform runbooks own
the evidence; Git history holds older port instructions.

## 0.2.18

The macOS target is Desktop `26.1023.51421` / build `22530`, with bundled CLI
`0.165.0-alpha.1.2`. Apply `standalone-output-compaction-22530` to exact upstream commit
`720fec862a608ae1e5878d1eecb04fb93192e93c`, then build with stable Rust `1.95.0` through
`bin/tmtk-build-codex` and its default LTO-off setting. Do not reuse the prior version's binary.

Exact build-`22530` profiles refresh the current generated owners, including the simplified
terminal dispatcher, sidebar unread/archive controls, family-aware title subscription, host bus,
and split bootstrap readiness writer. Shared attribution, alignment, and radio scroll anchoring
remain unchanged. The Dot guard preserves upstream request-time deletion-target revalidation;
TinRelay preserves the new native `followsInterruptedFinalAnswer` persistence rule.
The roster loader resolves the current manager atom through its actual stock export; its probe
checks that identity rather than accepting any requested symbol as a manager.
Syntax-check subprocess failures now report their underlying error instead of masking it.

All three compaction repair files are byte-identical to build `21828`'s stock source, so its
stock-red evidence carries by exact hashes, not by a new stock run. Both repaired-source tests
passed on this exact new revision. No experimental retention feature is enabled. The matching
release build and complete signed 18-patch stage passed. The corrected candidate returned to a
real task through the supervisor; roster colors, task-message ACK/wait, and two-way TinRelay
passed. The [macOS receipt](qualification/macos.md) records the exact hashes and smoke-test limits;
this is not a new full live feature tour or live compaction test.
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

1. Preserve any local checkout changes; use an immutable `0.2.18` revision and install dependencies.
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
