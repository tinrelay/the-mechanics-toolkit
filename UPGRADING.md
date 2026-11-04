# Upgrading The Mechanic's Toolkit

TMTK `0.2.20` is source-only. Use an exact published toolkit revision and inspect the official
package's **inner** Codex Desktop version and build before staging. An outer MSIX, DEB, or RPM
version alone is not a generated-JavaScript compatibility claim. The
[current build matrix](docs/extraction-ledger.md#current-build-matrix) and platform runbooks own
the evidence; Git history holds older port instructions.

## 0.2.20

The macOS port target is Desktop `26.1029.61003` / build `24614`, bundling CLI
`0.166.0-alpha.6`. Apply `standalone-output-compaction-24614` to exact upstream commit
`4f093f2748667f3b0e6a07e3d4055121cbd3ce64`, then build with stable Rust `1.95.0` through
`bin/tmtk-build-codex` and its default LTO-off setting. Use the matching binary.

The renderer now ships Rspack module registries rather than the former named ESM owners.
This port traces the actual runtime entry, module factories, imported selectors, React hooks,
and memo caches. It handles both known lazy tool-renderer copies and both timeline paths.
Receipt persistence, source-project attribution, right-aligned incoming bubbles, radio scroll
anchoring, roster colors, model-loading gates, and lifecycle protection retain their behavior.
The native main process remains split Webpack; its handler and readiness-writer imports moved.
The ASAR fleet still has 16 patches; the macOS package selection has 18.

The macOS restart supervisor also keeps a delayed native quit confirmation pending instead of
failing shutdown after 30 seconds. **Continue Waiting** extends the wait; **Cancel Restart** leaves
the installed app untouched. Candidate replacement still requires actual application termination.

Both focused compaction tests failed on exact stock source and passed after the three-file repair.
The stable-Rust native release build passed with LTO off and compiler override flags unset.
No experimental retention feature, provider call, or live compaction test was used.

The complete 16-patch composition and signed 18-patch stage passed, including post-repack probes,
byte-identical reapplication, signatures/seal, and native payload preservation. Supervised adoption
returned to the real chat; task-message ACK/wait and TinRelay self-send/return passed. The operator
accepted the visible result. Installed app and CLI hashes match the candidate. This is bounded live
smoke, not a new full feature tour or live compaction test. See the
[current macOS receipt](qualification/macos.md) for exact hashes and limits.
Windows/Ubuntu build `10954` and Fedora build `9647` are unchanged.

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

1. Preserve any local checkout changes; use an immutable `0.2.20` revision and install dependencies.
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
