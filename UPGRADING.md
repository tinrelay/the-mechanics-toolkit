# Upgrading The Mechanic's Toolkit

TMTK `0.2.17` is source-only. Use an exact published toolkit revision and inspect the official
package's **inner** Codex Desktop version and build before staging. An outer MSIX, DEB, or RPM
version alone is not a generated-JavaScript compatibility claim. The
[current build matrix](docs/extraction-ledger.md#current-build-matrix) and platform runbooks own
the evidence; Git history holds older port instructions.

## 0.2.17

The macOS target is Desktop `26.1021.31345` / build `21828`, with bundled CLI
`0.164.0-alpha.11.1`. Apply `standalone-output-compaction-21828` to exact upstream commit
`6905ecede7816e91373e9eabda3f6b0368fc747b`, then build with stable Rust `1.95.0` through
`bin/tmtk-build-codex` and its default LTO-off setting. Do not reuse the prior version's binary.

This is a generated-owner and module-boundary refresh. Roster/palette/attention bootstrap and
keyboard dispatch now live in `app-runtime`, sidebar actions in `app-primary`, and app-control
tool constants in their own module. Exact build-`21828` profiles preserve the shared policies,
family-aware reactive recipient names, incoming/outgoing alignment, and radio scroll anchoring.
The registry publishes capabilities from their actual runtime owner. Final renderer readiness
comes from mounted routes in `app-primary`, not its initialization-only event.

Both compaction tests failed on this exact stock source and passed after the narrow repair;
upstream annotated-message handling is preserved. No experimental retention feature is enabled.
The signed 18-patch stage passed complete composition, post-repack probes, native preservation,
signature/seal checks, and byte-identical second application. Static stage and live adoption
remain separate gates in the [macOS receipt](qualification/macos.md).
Build `21828` returned to a usable real task through supervised adoption without rescue.
The installed ASAR and CLI match the staged hashes; task messaging received an ACK, the wait
ran, and a TinRelay self-ping returned. This is not a full live feature tour.
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

1. Preserve any local checkout changes; use an immutable `0.2.17` revision and install dependencies.
   Run `npm run check` and `npm test` before staging. Copy the relevant
   `examples/toolkit.<platform>.example.json` to ignored `toolkit.local.json`, replacing its
   fictional paths and retaining only still-applicable private policy.
2. Acquire one authenticated pristine package for the platform and architecture. Inspect its
   inner Desktop identity and select the exact supported profile. Stage one complete candidate
   with `stage-macos`, `stage-msix`, `stage-deb`, or `stage-rpm`; staging never installs or launches.
   Windows staging also requires a separately verified same-inner-build known-good source.
3. Adopt through the documented platform procedure after explicit operator confirmation. Verify a
   real task and editable composer, not only a renderer-ready marker: a previous macOS candidate
   reached that marker while displaying Codex's Oops screen. macOS build `21828` and Windows
   build `10954` have supervised task-return evidence; Ubuntu build `10954` has only
   direct-install/open evidence.
4. Retain compact receipts and hashes, one pristine package and one current candidate. Remove
   failed and superseded bulk, extracted trees, and transaction-only rollback copies after the
   replacement ends.

TMTK does not distribute vendor applications or patched binaries. See [usage](docs/usage.md),
[staging](docs/staging.md), and the [platform runbooks](qualification/) for exact commands and
residual boundaries.
