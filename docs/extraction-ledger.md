# Extraction ledger

This repository is the canonical source for the portable patch fleet. This ledger is its current
build and qualification index; patch READMEs own stable behavior, and platform runbooks own exact
package hashes and operational receipts. Git history holds superseded ports.

## Current build matrix

| Platform package | Current Desktop target | Fleet | Highest proved gate |
| --- | --- | --- | --- |
| macOS ARM64 application | `26.1103.41825` / `25679` | 18 default; 19 with Computer Use | Signed 19-patch stage, supervised usable-task return, task-message ACK/wait, TinRelay self-return and native Chrome read without fresh consent. |
| Windows MSIX | `26.917.71314` / `10954` | Prior 16-patch receipt | ARM64 signed stage, genuine task-led supervised adoption, usable task, and visible roster/palette |
| Ubuntu DEB | `26.917.71314` / `10954` | Prior 16-patch receipt | ARM64 authenticated stage, direct installation, usable task, and visible roster/palette; supervisor not exercised |
| Fedora RPM | `26.911.61220` / `9647` | Prior 16-patch receipt | AArch64 authenticated stage, supervised adoption, renderer readiness, and focused live features |

Windows tooling supports x64 and ARM64; DEB supports `amd64` and `arm64`; RPM supports `x86_64`
and `aarch64`. The current package and live receipts above are ARM64/AArch64. An agent installing
on x64/amd64 must inspect the official architecture-matched package and pass the exact inner-build,
native-payload, complete-fleet, package-integrity, and adoption gates. Lack of an x86-family lab
result is not a prohibition or a reason to substitute ARM binaries.

The vendor offers a Fedora AArch64 build-`10954` RPM with a pristine ASAR byte-identical to the
Ubuntu build-`10954` DEB. Its RPM stage and launch are not yet qualified, so Fedora build `9647`
remains its last accepted package. The official Windows x64 MSIX has the same outer version as the
ARM64 offer, but its **inner** Desktop build has not been checked; outer version alone cannot
select a generated-JavaScript profile.

## Fleet-wide evidence and limits

The CLI and native Computer Use helper are byte-identical to the preceding authenticated package.
The exact qualified source repair/binary and helper authorization policy are reused; no new Rust
build, feature toggle or private-socket helper experiment was needed. Persistent certificate
identity and the private mode-`0700` socket remain unchanged. A current post-update native Chrome
accessibility read passed without another consent flow; screenshots/control and the separate
browser-provider path remain unqualified.

Exact `build25679` Rspack profiles cover the changed runtime/shared/terminal/bootstrap chunks,
three lazy tool-renderer/classifier copies and both transcript paths. The absent thread-level
collapse effect stays unpatched; manual choices and the remaining turn policy retain their owners.
Legacy ESM regression fixtures remain for the separately supported Windows/Linux builds.

| Boundary | Current result |
| --- | --- |
| Source repair | Same `.167.0-alpha.3.2` stock binary and source; prior stock-red/repaired-green and release build reused. No new Rust test/build or live compaction run. |
| Package integrity | Complete signed 19-patch stage; post-repack probes, byte-identical reapplication, signatures/seal and native payload/mode preservation passed. |
| Permission identity | Actual requirements match and preview preserves grants without `tccutil`. Current native Chrome accessibility read passed without fresh consent. |
| Live adoption | Build `25679` adopted through the supervisor; real chat, task-message ACK/wait, TinRelay self-return and operator visual acceptance passed. |
| Shared behavior | Exact-owner preflight, composed and post-repack probes passed, including actual lazy bubble bindings and both transcript paths. |
| Open limits | Screenshots/control, separate browser provider, full feature tour, live compaction and other-platform live paths remain separately unqualified. |

See [macOS](../qualification/macos.md), [Windows](../qualification/windows.md), and
[Linux](../qualification/linux.md) qualification for hashes and exact residuals. The
[standalone-output compaction repair](../source-patches/standalone-output-compaction/) is a separate
same-version Codex CLI source patch installed with macOS build `25679` but
not the Windows or Linux package fleets.
The separate [query-depth source patch](../source-patches/chatgpt-query-depth/) enables a stable-Rust
rebuild of that CLI on hosts where `codex-chatgpt` exceeds the compiler limit; it was applied to
the accepted build-`11645` source checkout and is not needed for the current CLI. It does
not change the desktop JavaScript fleet.

## Extraction rule

A slice moves only when it has one portable owner, no personal path or identity data, a focused
probe, an explicit compatibility claim, and a failure mode that leaves the operator's working
application untouched. Copying source is not adoption.
