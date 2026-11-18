# Extraction ledger

This repository is the canonical source for the portable patch fleet. This ledger is its current
build and qualification index; patch READMEs own stable behavior, and platform runbooks own exact
package hashes and operational receipts. Git history holds superseded ports.

## Current build matrix

| Platform package | Current Desktop target | Fleet | Highest proved gate |
| --- | --- | --- | --- |
| macOS ARM64 application | `26.1111.71025` / `28661` | 18 default; 19 with Computer Use | Operator accepted corrected adoption and the 0.2.27 footer visual fix; task-message ACK/wait across compaction and TinRelay return passed on unchanged transport. |
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

## Composer-footer correction

TMTK `0.2.27` keeps the same Desktop/CLI target. The palette now tags the active composer footer
as well as the legacy fade. Only the footer pseudo-elements receive the room surface token;
native geometry/transparency and child composer surfaces are preserved. Signed 19-patch staging, post-repack probes, reapplication and native-CSS browser checks passed.
The supervised restart reached readiness; the operator accepted the corrected footer visually.
CLI/native and messaging logic are unchanged; their prior live checks were not repeated.

## Fleet-wide evidence and limits

The current CLI repair passed exact stock-red/repaired-green local and remote-v2 tests and a
native release build. This revision needs no authentication-fixture correction. The independent
Computer Use helper probe passed stock vendor-Node rejection, repaired ping acceptance and
continued unsigned-Python rejection. No experimental retention flag or macOS privacy grant was changed.

Exact `build28661` profiles cover the new renderer/native owners, three lazy tool-renderer copies,
both keyboard dispatchers and both transcript paths. Outgoing previews adapt the stock compound tooltip and defer the
conversation formatter until render. Legacy fixtures remain for supported Windows/Linux targets.
The absent thread-level collapse effect stays unpatched. The Space-notification count remains
outside task-attention policy.

| Boundary | Current result |
| --- | --- |
| Source repair | Exact `.169.0-alpha.11.1`: 2 stock failures, 2 repaired passes; native Rust 1.95.0 release build passed. |
| Helper authorization | Current private-socket stock/repaired/rejected-peer proof passed. |
| Shared behavior and packaging | Complete signed 19-patch stage, composed/post-repack probes, byte-identical reapplication, native payload preservation, signature and ASAR seal passed. |
| Permission identity | Candidate and existing helper have identical certificate-based signing requirements; no privacy reset invoked. |
| Live adoption | First attempt failed on a removed decoder export; exact two-import rescue correction verified. Supervisor ready; operator accepted qualification. Real chat, native ACK/wait across compaction and TinRelay return passed. |
| Repository | `npm run check` and `npm test` passed; production DEB/RPM staging fixtures platform-skipped. |
| Open limits | One live delegated request survived compaction; general replay prevention is not proved. Chrome/native Computer Use actions and a full feature tour were not rerun. |

See [macOS](../qualification/macos.md), [Windows](../qualification/windows.md), and
[Linux](../qualification/linux.md) qualification for hashes and exact residuals. The
[standalone-output compaction repair](../source-patches/standalone-output-compaction/) is a separate
same-version Codex CLI source patch selected for macOS build `28661` but
not the Windows or Linux package fleets.
The separate [query-depth source patch](../source-patches/chatgpt-query-depth/) enables a stable-Rust
rebuild of that CLI on hosts where `codex-chatgpt` exceeds the compiler limit; it was applied to
the accepted build-`11645` source checkout and is not needed for the current CLI. It does
not change the desktop JavaScript fleet.

## Extraction rule

A slice moves only when it has one portable owner, no personal path or identity data, a focused
probe, an explicit compatibility claim, and a failure mode that leaves the operator's working
application untouched. Copying source is not adoption.
