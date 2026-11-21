# Extraction ledger

This repository is the canonical source for the portable patch fleet. This ledger is its current
build and qualification index; patch READMEs own stable behavior, and platform runbooks own exact
package hashes and operational receipts. Git history holds superseded ports.

## Current build matrix

| Platform package | Current Desktop target | Fleet | Highest proved gate |
| --- | --- | --- | --- |
| macOS ARM64 application | `26.1117.41037` / `29803` | 17 default; 18 with Computer Use | Signed 18-patch stage, supervised adoption, real chat, task ACK/wait and two-way TinRelay passed. |
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

Exact `build29803` profiles cover the current renderer/native owners, all five lazy tool copies,
both keyboard dispatchers, and the common transcript owner used by native and MCP turns. The
shared item module split into new owners; task-message metadata, receipts, reasoning policy and
TinRelay registration follow the actual current bindings. The history wrapper still intercepts
full command output before native deferral. The composer footer retains its scoped room token.
Supported Linux/Windows profiles remain separate and unchanged.

The vendor CLI `0.171.0-alpha.13` is byte-identical to the accepted 29513 executable. The packaged
sender/version comparator still requests marked-delegation retention. The macOS compaction source
repair remains dormant; the previous exact-source stock tests remain applicable to the same
executable. This does not establish general unmarked-output retention or every consumed-input
replay repair. No replacement CLI or Rust build is selected.

The optional Computer Use helper's normalized image is also identical to 29513. Its exact repair
and persistent-signing contract are unchanged. The earlier private-socket and live browser/native
results belong to that accepted build. They do not prove a new launch of 29803.

Complete signed 18-patch staging, post-repack probes, byte-identical reapplication, native
preservation, signature/seal, native-CSS footer checks and repository checks/tests passed. Four
patched startup cache entries were removed; 26 untouched entries are preserved. The optional
helper retains the existing certificate-based designated requirement without a privacy reset.
Supervised adoption reached renderer readiness without rescue and returned to the real chat.
Installed 29803 matches the qualified candidate with valid signature/seal. Vera's fresh ACK and
wait completion passed. TinRelay self-send was accepted, routed and returned, with both outgoing
and incoming cards rendered in the viewport. Browser/native actions were not repeated.
The [macOS runbook](../qualification/macos.md) owns hashes and exact gates. See also [Windows](../qualification/windows.md) and
[Linux](../qualification/linux.md).

## Extraction rule

A slice moves only when it has one portable owner, no personal path or identity data, a focused
probe, an explicit compatibility claim, and a failure mode that leaves the operator's working
application untouched. Copying source is not adoption.
