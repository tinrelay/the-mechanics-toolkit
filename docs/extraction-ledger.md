# Extraction ledger

This repository is the canonical source for the portable patch fleet. This ledger is its current
build and qualification index; patch READMEs own stable behavior, and platform runbooks own exact
package hashes and operational receipts. Git history holds superseded ports.

## Current build matrix

| Platform package | Current Desktop target | Fleet | Highest proved gate |
| --- | --- | --- | --- |
| macOS ARM64 application | `26.1106.51428` / `26605` | 18 default; 19 with Computer Use | Corrected signed stage adopted; real chat, task-message ACK/wait, TinRelay return, native Chrome accessibility and dedicated Chrome tab control passed. |
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

This package changes both the CLI and native Computer Use helper. The exact new source repair and
native helper policy passed bounded causal qualification; the previous replacement CLI cannot be reused. The
private-socket helper probe shows stock vendor-Node rejection, repaired ping acceptance and continued
unsigned-Python rejection. Persistent certificate identity and the private socket policy are
unchanged. Final candidate and existing helper signing requirements match without a privacy reset;
native Chrome accessibility reads also passed after adoption without a new consent flow.

Exact `build26605` Rspack profiles cover new app/runtime/shared/bootstrap owners, two current lazy
tool-renderer/classifier copies and both transcript paths. The absent thread-level collapse effect
stays unpatched. Legacy ESM fixtures remain for supported Windows/Linux builds. The new Space
notification count has a different owner and is not filtered as a task-completion badge.

The current native peer patch also corrects dedicated Chrome's generated browser MCP launch
ancestry. Packaged vendor Node stays above the packaged REPL, so the unchanged Chrome host accepts
its parent identity despite the rebuilt CLI above it. Exact-launcher handshake and unsigned-client
rejection passed; stdio, environment, exit and stop probes passed. The final candidate was adopted;
dedicated extension discovery, tab creation/navigation, DOM reading and tab closure passed.

| Boundary | Current result |
| --- | --- |
| Source repair | Exact `.167.0-alpha.4.1` stock-red local/remote-v2 regressions; shared test-only auth fixture correction. Repaired tests and the native release build passed. |
| Package integrity | Signed 19-patch stage, native payload preservation, signature and ASAR seal passed. |
| Permission identity | New helper private-socket authorization proof passed; final helper signing requirement preserved. Post-restart native Chrome accessibility read passed without new consent. |
| Live adoption | First `26605` candidate failed real-chat activation. Corrected candidate adopted; operator reports real chat works. Task-message ACK/wait and TinRelay return passed. |
| Shared behavior | All 16 preflight checks, composed/post-repack probes and byte-identical reapplication passed. Repository checks/tests passed. |
| Dedicated Chrome | Final browser-parent candidate adopted; extension discovery and disposable-tab creation, navigation, DOM read and closure passed. |
| Open limits | Live compaction, full feature tour, native screenshots/input and secondary-platform live paths remain unqualified. |

See [macOS](../qualification/macos.md), [Windows](../qualification/windows.md), and
[Linux](../qualification/linux.md) qualification for hashes and exact residuals. The
[standalone-output compaction repair](../source-patches/standalone-output-compaction/) is a separate
same-version Codex CLI source patch selected for macOS build `26605` but
not the Windows or Linux package fleets.
The separate [query-depth source patch](../source-patches/chatgpt-query-depth/) enables a stable-Rust
rebuild of that CLI on hosts where `codex-chatgpt` exceeds the compiler limit; it was applied to
the accepted build-`11645` source checkout and is not needed for the current CLI. It does
not change the desktop JavaScript fleet.

## Extraction rule

A slice moves only when it has one portable owner, no personal path or identity data, a focused
probe, an explicit compatibility claim, and a failure mode that leaves the operator's working
application untouched. Copying source is not adoption.
