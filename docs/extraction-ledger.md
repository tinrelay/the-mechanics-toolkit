# Extraction ledger

This repository is the canonical source for the portable patch fleet. This ledger is its current
build and qualification index; patch READMEs own stable behavior, and platform runbooks own exact
package hashes and operational receipts. Git history holds superseded ports.

## Current build matrix

| Platform package | Current Desktop target | Fleet | Highest proved gate |
| --- | --- | --- | --- |
| macOS ARM64 application | `26.1023.51421` / `22530` | 18 selected | Exact-source repaired compaction tests, matching release build, signed static stage, supervised task return, roster colors, task-message ACK/wait, and two-way TinRelay |
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

Build `22530` refreshes exact generated owners and the stock terminal dispatch, unread/archive,
host-bus, title-family, and split readiness-writer contracts. The Dot guard preserves native
request-time target revalidation; radio persistence retains the new interrupted-final-answer rule.
These current owners are not live-accepted by inheritance from `21828`.
The first `22530` adoption opened a real task but failed roster loading and therefore colors.
Its corrected manager binding passed a new actual-export regression and complete signed restaging;
the corrective supervised adoption returned to the real task with restored roster colors, a
task-message ACK and wait, and two-way TinRelay. No real dot was deleted or rebooted during qualification.
Stock React bindings, effective selected model, locked reasoning effort, and neutral loading gates
remain covered by causal probes. This does not claim a new full live feature tour.

| Boundary | Current result |
| --- | --- |
| Generated JavaScript | Exact `build22530` profiles target the macOS refresh; prior Windows/Ubuntu build `10954` and Fedora build `9647` owners remain. Shared feature implementations are not forked per OS. Renderer turn-window and retired sidebar collapse remain unselected on macOS. |
| Package integrity | The build-`22530` vendor ZIP, signature, notarization staple, and ASAR seal authenticated. The matching release binary and signed 18-patch candidate passed complete composition, byte-identical reapplication, native preservation, and post-repack probes. Secondary platforms retain their named earlier receipts. |
| Live adoption | Corrected macOS build `22530` returned to the real task through the supervisor without rescue, with matching installed hashes, restored roster colors, a task-message ACK and wait, and two-way TinRelay. No new full live feature tour is claimed. Windows build `10954` retains supervised task-return evidence; Ubuntu build `10954` opened a usable task after direct installation; Fedora build `9647` retains earlier supervisor evidence. |
| Shared behavior | Current generated-owner fixtures cover exact imports, model loading, reasoning, archive protection, attribution, receipts, waits, radio, and readiness. Composition and package gates are recorded in the macOS runbook; a green static gate does not imply live acceptance. Windows and Ubuntu retain their earlier package/open receipts. |
| Open limits | Dot guards outside the patched desktop, Ubuntu build-`10954` supervisor replacement, Fedora build-`10954` RPM stage/open, x86-family package/live paths, a live greater-than-200-turn fixture, and a task-message-triggered compaction boundary remain unqualified. An earlier macOS Oops incident showed that `renderer.ready` can precede a usable task; confirm actual task UI after adoption. |

See [macOS](../qualification/macos.md), [Windows](../qualification/windows.md), and
[Linux](../qualification/linux.md) qualification for hashes and exact residuals. The
[standalone-output compaction repair](../source-patches/standalone-output-compaction/) is a separate
same-version Codex CLI source patch selected for the macOS build-`22530` candidate but
not the Windows or Linux package fleets.
The separate [query-depth source patch](../source-patches/chatgpt-query-depth/) enables a stable-Rust
rebuild of that CLI on hosts where `codex-chatgpt` exceeds the compiler limit; it was applied to
the accepted build-`11645` source checkout and is not needed for the current CLI. It does
not change the desktop JavaScript fleet.

## Extraction rule

A slice moves only when it has one portable owner, no personal path or identity data, a focused
probe, an explicit compatibility claim, and a failure mode that leaves the operator's working
application untouched. Copying source is not adoption.
