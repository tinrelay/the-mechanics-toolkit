# Extraction ledger

This repository is the canonical source for the portable patch fleet. This ledger is its current
build and qualification index; patch READMEs own stable behavior, and platform runbooks own exact
package hashes and operational receipts. Git history holds superseded ports.

## Current build matrix

| Platform package | Current Desktop target | Fleet | Highest proved gate |
| --- | --- | --- | --- |
| macOS ARM64 application | `26.1103.32239` / `25471` | 18 default; 19 with Computer Use | Signed 19-patch stage, source red/green, supervised usable-task return, task-message ACK/wait, TinRelay self-return and native Chrome read without fresh consent. |
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

The current opt-in helper is `26.1102.1001824` / `1001824`. Its entire unsigned Mach-O
image is pinned, and a private-socket probe proves repaired vendor-Node acceptance with unsigned
Python rejection. The superseded helper profile is removed; incoming helper recognition does not
require recognizing the prior helper image to compare signing requirements. Persistent certificate
identity, dedicated mode-`0700` socket and per-machine consent remain unchanged. The same-signer
upgrade preserved native Chrome accessibility access without another permission flow.

Exact `build25471` Rspack profiles cover all three lazy tool-renderer/classifier copies, both
transcript paths, current RPC factories and native main/bootstrap ownership. The old thread-level
auto-collapse effect is absent upstream; the remaining reasoning collapse policy stays active.
Legacy ESM regression fixtures remain for the separately supported Windows/Linux builds.

| Boundary | Current result |
| --- | --- |
| Source repair | Exact `.167.0-alpha.3.2` stock-red/repaired-green local and remote-v2 tests; no experimental flag or live compaction run. |
| Package integrity | Complete signed 19-patch stage; post-repack probes, byte-identical reapplication, signatures/seal and native payload preservation passed. |
| Permission identity | Actual helper requirements match; preview preserves grants without `tccutil`. Native Chrome accessibility read passed after upgrade without fresh consent. |
| Live adoption | Corrected build `25471` installed through the supervisor; real chat, task-message ACK/wait, TinRelay self-return and operator visual acceptance passed. |
| Shared behavior | Probes cover identity, native RPC readiness, title hydration, persistence, right alignment, scroll ownership, live policy reload and readiness. |
| Open limits | Screenshot/control, separate browser-provider path, full live feature tour, live compaction, secondary-platform and x86-family live paths remain separately unqualified. |

See [macOS](../qualification/macos.md), [Windows](../qualification/windows.md), and
[Linux](../qualification/linux.md) qualification for hashes and exact residuals. The
[standalone-output compaction repair](../source-patches/standalone-output-compaction/) is a separate
same-version Codex CLI source patch installed with macOS build `25471` but
not the Windows or Linux package fleets.
The separate [query-depth source patch](../source-patches/chatgpt-query-depth/) enables a stable-Rust
rebuild of that CLI on hosts where `codex-chatgpt` exceeds the compiler limit; it was applied to
the accepted build-`11645` source checkout and is not needed for the current CLI. It does
not change the desktop JavaScript fleet.

## Extraction rule

A slice moves only when it has one portable owner, no personal path or identity data, a focused
probe, an explicit compatibility claim, and a failure mode that leaves the operator's working
application untouched. Copying source is not adoption.
