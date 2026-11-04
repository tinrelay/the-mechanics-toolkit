# Extraction ledger

This repository is the canonical source for the portable patch fleet. This ledger is its current
build and qualification index; patch READMEs own stable behavior, and platform runbooks own exact
package hashes and operational receipts. Git history holds superseded ports.

## Current build matrix

| Platform package | Current Desktop target | Fleet | Highest proved gate |
| --- | --- | --- | --- |
| macOS ARM64 application | `26.1029.61003` / `24614` | 18 selected | Signed stage and supervised adoption passed; real task return, task-message ACK/wait, TinRelay self-send/return, and operator visual acceptance. Exact-source red/green, native release build, full fleet, post-repack probes and byte-identical reapplication passed. |
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

Build `24614` changes the renderer to Rspack module registries. The port uses Acorn to edit exact
module-factory bodies while preserving sibling bytes, checks module IDs and parameters, and
captures imports outside component-local bindings. Both lazy tool-renderer copies are covered.
The native Webpack handler and relaunch-writer import are traced through the package loader.
The roster uses the stock RPC factory's ready/deferred path; model publication waits for loading.
Receipts and radio presentations cover both timeline paths without taking latest-response follow
ownership. Stock source still fails both local/remote-v2 compaction tests; the exact repair passes.
No experimental feature or live compaction run is part of this proof.

| Boundary | Current result |
| --- | --- |
| Generated JavaScript | Exact `build24614` module profiles target the installed renderer. Legacy ESM transform regression fixtures remain covered while Windows/Ubuntu `10954` and Fedora `9647` use those readers. |
| Package integrity | Vendor ZIP signature, app signature, notarization staple, and ASAR seal authenticated. Complete signed 18-patch stage, post-repack probes, byte-identical reapplication, and native payload preservation passed; see the macOS receipt. |
| Live adoption | Build `24614` adopted through the supervisor, reached renderer readiness, and returned to the real task. Installed app/CLI hashes match; task-message ACK/wait, TinRelay round trip, and operator visual acceptance passed. |
| Shared behavior | Focused probes cover source identity, compiled component bindings, title hydration, acknowledgement/persistence, right alignment, scroll settling, policy reloads, and readiness. Static proof does not imply a usable live task. |
| Open limits | Full live feature tour, live compaction, deliberately delayed native quit confirmation, dot guards outside the patched desktop, Ubuntu `10954` supervisor replacement, Fedora `10954` RPM stage/open, and x86-family live paths remain unqualified. |

See [macOS](../qualification/macos.md), [Windows](../qualification/windows.md), and
[Linux](../qualification/linux.md) qualification for hashes and exact residuals. The
[standalone-output compaction repair](../source-patches/standalone-output-compaction/) is a separate
same-version Codex CLI source patch installed with macOS build `24614` but
not the Windows or Linux package fleets.
The separate [query-depth source patch](../source-patches/chatgpt-query-depth/) enables a stable-Rust
rebuild of that CLI on hosts where `codex-chatgpt` exceeds the compiler limit; it was applied to
the accepted build-`11645` source checkout and is not needed for the current CLI. It does
not change the desktop JavaScript fleet.

## Extraction rule

A slice moves only when it has one portable owner, no personal path or identity data, a focused
probe, an explicit compatibility claim, and a failure mode that leaves the operator's working
application untouched. Copying source is not adoption.
