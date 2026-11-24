# Extraction ledger

This repository is the canonical source for the portable patch fleet. This ledger is its current
build and qualification index; patch READMEs own stable behavior, and platform runbooks own exact
package hashes and operational receipts. Git history holds superseded ports.

## Current build matrix

| Platform package | Current Desktop target | Fleet | Highest proved gate |
| --- | --- | --- | --- |
| macOS ARM64 application | `26.1120.41243` / `30607` | 18 default; 19 with Computer Use | Signed fleet, supervised adoption, real chat, task ACK/wait, TinRelay ordering and dedicated Chrome passed. |
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

TMTK 0.2.31 ports the current macOS fleet to exact `build30607` profiles. Native startup and
renderer ownership changed; one lazy tool module replaces five copies, and two native catalogs
own terminal commands. The original history item still reaches TinRelay presentation before native
output deferral. Common transcript receipt registration uses the current native turn lifecycle.

The existing protection flag now removes permanent deletion from individual sidebar/title menus
and mixed protected bulk selections. Native eligibility and callbacks remain intact for ordinary
chats. The former browser parent wrapper is retired because the new native builder owns direct
packaged-Node launch. Access flags, policy and trusted-service configuration remain native.

Vendor CLI `0.171.0-alpha.13.2` reports marked-output retention stable/default-on. Its actual
sender/version comparator passes. Both compaction source files are unchanged from the previously
proved exact source, so the local repair remains dormant. This does not establish general
unmarked-output retention or every handled-input replay repair. No replacement CLI is selected.

The optional Computer Use repair follows the unchanged non-call instruction structure of the new
helper's relocated parent gate. The immediate vendor-team check and persistent signing identity
remain. The app-context default fingerprint changed; override delivery still requires cold resume.

Complete signed 19-patch staging passed, including actual initializer/export and render probes,
changed-module syntax, byte-identical reapplication, post-repack verification, native preservation,
signature/seal and native-CSS footer checks. The final installed ASAR matches the accepted candidate.
The helper signing requirement is preserved without a privacy reset. Repository checks/tests passed;
production Linux package staging fixtures were platform-skipped.

Supervised adoption returned to a real continuing chat. The operator accepted task-message ACK
cards, wait rendering and active name colors, and TinRelay send/return/reply order after activity
collapse. Dedicated Chrome extension tab creation, page reading and cleanup also passed. The port
fixed stale native action/container bindings, native shimmer overriding identity paint, and the
completed outgoing card's registration boundary; regression probes now cover those exact seams.
Protected-menu behavior has packaged behavioral coverage, but manual menu checks and native
accessibility actions were not repeated. These are evidence limits, not claims of live acceptance.
The [macOS runbook](../qualification/macos.md) owns exact hashes and gates;
[Windows](../qualification/windows.md) and [Linux](../qualification/linux.md) retain their existing
platform targets and receipts.

## Extraction rule

A slice moves only when it has one portable owner, no personal path or identity data, a focused
probe, an explicit compatibility claim, and a failure mode that leaves the operator's working
application untouched. Copying source is not adoption.
