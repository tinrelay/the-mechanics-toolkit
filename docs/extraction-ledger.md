# Extraction ledger

This repository is the canonical source for the portable patch fleet. This ledger is its current
build and qualification index; patch READMEs own stable behavior, and platform runbooks own exact
package hashes and operational receipts. Git history holds superseded ports.

## Current build matrix

| Platform package | Current Desktop target | Fleet | Highest proved gate |
| --- | --- | --- | --- |
| macOS ARM64 application | `26.1120.50957` / `30866` | 18 default; 19 with Computer Use | Signed complete fleet, post-repack probes and byte-identical reapplication passed; live acceptance pending. |
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

TMTK 0.2.32 ports the current macOS fleet to exact `build30866` profiles. Native startup and the
bundled CLI are byte-identical to the preceding authenticated target. Renderer assets and local
transcript variables changed; exact profile bindings follow their current semantic owners.

The protected permanent-delete guard, wait identity paint, original-output TinRelay classifier and
send-before-return-before-reply registration remain. Native browser launch stays upstream-owned.
The stock CLI retains marked-output retention, so the local compaction repair remains dormant;
this is not proof of general unmarked-output or handled-input replay correctness.

The optional Computer Use helper's exact normalized stock image is unchanged. Its narrow repair,
immediate vendor-peer check and persistent signing requirement remain. Bundled native app-context
code is unchanged. No authentication, chat-history or privacy reset is part of this port.

The complete signed fleet passed actual initializer/export and render probes, changed-module syntax,
byte-identical reapplication, post-repack verification, native payload preservation, signature and
ASAR integrity. The helper permission preview reported preserved using only codesign.
Repository syntax, full tests and hygiene passed; Linux production staging fixtures were
platform-skipped. Supervised adoption and real continuing-chat acceptance are pending. The [macOS runbook](../qualification/macos.md) records package hashes, static proof and
live gates. [Windows](../qualification/windows.md) and [Linux](../qualification/linux.md) retain
their existing platform targets and receipts.

## Extraction rule

A slice moves only when it has one portable owner, no personal path or identity data, a focused
probe, an explicit compatibility claim, and a failure mode that leaves the operator's working
application untouched. Copying source is not adoption.
