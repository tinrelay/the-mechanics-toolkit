# Extraction ledger

This repository is the canonical source for the portable patch fleet. This ledger is its current
build and qualification index; patch READMEs own stable behavior, and platform runbooks own exact
package hashes and operational receipts. Git history holds superseded ports.

## Current build matrix

| Platform package | Current Desktop target | Fleet | Highest proved gate |
| --- | --- | --- | --- |
| macOS ARM64 application | `26.1117.31558` / `29513` | 17 default; 18 with Computer Use | Supervised adoption, task ACK/wait, two-way TinRelay, Chrome control and native observation passed. |
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

Exact `build29513` profiles cover the current renderer/native owners, all five lazy tool copies,
both keyboard dispatchers, and the common transcript owner used by native and MCP turns. The
composer footer retains its scoped room-color token and native geometry. Outgoing previews keep
cold initialization independent of the conversation formatter. Supported Linux/Windows profiles
remain separate and unchanged.

The macOS compaction source repair is dormant for this target. The actual Desktop adapter requests
retention and the stock `.171.0-alpha.13` CLI enables it by default. Two exact-source tests passed
for marked delegation ordering and remote-v2 retention; the packaged sender/version gate also
passed. No production Rust source repair or replacement CLI is selected. Earlier exact diffs stay
available as regression references, not current macOS staging inputs. This does not establish
retention of ordinary unmarked outputs or prevention of every consumed-message replay.

Complete signed 18-patch staging, post-repack probes, byte-identical reapplication, repository checks
and tests passed. Four changed startup files lose their optional Owl bytecode entries; the other
26 entries remain byte-identical. Native-CSS browser checks preserve footer colors and geometry.
Initial supervised launch, real-chat operation, message/ACK/wait and TinRelay return passed. Mike
then found the outgoing card absent. After correcting pre-deferral presentation and another
supervised restart, a fresh send has its source-turn anchor, outgoing card rendered in the viewport,
and returned incoming delivery. A temporary dedicated Chrome tab was created, navigated, read
and closed; native accessibility observation of the canonical Codex app also passed without a new permission flow. Pixel capture
and input were not exercised. The [macOS runbook](../qualification/macos.md) owns hashes and exact gates.
See also [Windows](../qualification/windows.md) and [Linux](../qualification/linux.md).

## Extraction rule

A slice moves only when it has one portable owner, no personal path or identity data, a focused
probe, an explicit compatibility claim, and a failure mode that leaves the operator's working
application untouched. Copying source is not adoption.
