# Upgrading The Mechanic's Toolkit

TMTK `0.2.3` is source-only. Use an exact published toolkit revision and inspect the official
package's **inner** Codex Desktop version and build before staging. An outer MSIX, DEB, or RPM
version alone is not a generated-JavaScript compatibility claim. The
[current build matrix](docs/extraction-ledger.md#current-build-matrix) and platform runbooks own
the evidence; Git history holds the old port instructions.

## 0.2.3

The shared patch fleet now recognizes Desktop `26.917.71314` / build `10954` on macOS, Windows,
and Ubuntu. Build-specific profiles remain exact and fail closed; this is one feature fleet, not
three platform implementations. The renderer-turn-window patch is selected but `upstream-owned`
when the vendor already provides the verified turn-pagination behavior, so staging leaves those
bytes unchanged. The standalone-output compaction source repair is qualified for the same-version
macOS bundled Codex CLI `0.155.0-alpha.16.4`.

| Package | Current evidence |
| --- | --- |
| macOS application | ARM64 build `10954`: complete stage, supervised replacement, usable task, outgoing message, and TinRelay loopback. |
| Windows MSIX | ARM64 build `10954`: signed stage and genuine task-led supervised replacement returned to a usable task. The tooling also accepts x64; no x64 package or launch was tested. |
| Ubuntu DEB | ARM64 build `10954`: authenticated stage and direct installation opened a usable task. The `10954` supervisor path was **not** exercised because the previous installed app could not open a task. The adapter also accepts `amd64`; no amd64 package or launch was tested. |
| Fedora RPM | Build `9647` remains the last qualified and installed AArch64 RPM. The vendor now offers a build-`10954` AArch64 RPM with the same pristine ASAR as Ubuntu, but its RPM stage and launch have **not** been qualified. The adapter also accepts `x86_64`; no x86_64 package or launch was tested. |

The lack of an x64/amd64 live test is an evidence boundary, not an artificial architecture block.
An installing agent may inspect the official package on that architecture, stage against its exact
inner build, and proceed when package integrity, the complete patch fleet, and adoption checks
pass. Never substitute the ARM64 package or native binaries, infer the inner build from the outer
version, or weaken a failed check.

## Operator path

1. Preserve any local checkout changes; use an immutable `0.2.3` revision and install dependencies.
   Run `npm run check` and `npm test` before staging. Copy the relevant
   `examples/toolkit.<platform>.example.json` to ignored `toolkit.local.json`, replacing its
   fictional paths and retaining only still-applicable private policy.
2. Acquire one authenticated pristine package for the platform and architecture. Inspect its
   inner Desktop identity and select the exact supported profile. Stage one complete candidate
   with `stage-macos`, `stage-msix`, `stage-deb`, or `stage-rpm`; staging never installs or launches.
   Windows staging also requires a separately verified same-inner-build known-good source.
3. Adopt through the documented platform procedure after explicit operator confirmation. Verify a
   real task and editable composer, not only a renderer-ready marker: a previous macOS candidate
   reached that marker while displaying Codex's Oops screen. The current healthy macOS and Windows
   supervisor paths are qualified; Ubuntu build `10954` has only direct-install/open evidence.
4. Retain compact receipts and hashes, one pristine package and one current candidate. Remove
   failed and superseded bulk, extracted trees, and transaction-only rollback copies after the
   replacement ends.

No Codex task-database migration is required. TMTK does not distribute vendor applications or
patched binaries. See [usage](docs/usage.md), [staging](docs/staging.md), and the
[platform runbooks](qualification/) for exact commands and residual boundaries.
