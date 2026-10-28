# macOS desktop qualification

This document contains two related qualifications with separate conclusions:

- **Patchset qualification** proves that one exact Codex Desktop version/build and enabled patch
  fleet passes complete static proof and launches cleanly. Each selected feature needs either a
  current live result or an explicitly recorded earlier live result whose semantic owner and
  behavior remain equivalent. Changed, uncertain, or newly composed seams require a current live
  check. The supervisor surrounds that restart as recovery protection, but must not activate.
- **Supervisor capability qualification** deliberately exercises blank-renderer and living-Oops
  failures to prove that recovery itself works. It is repeated when the supervisor contract or one
  of its relevant integration boundaries changes, not merely because another patch was added or
  restyled.

Do not report a rescued patchset launch as a patchset pass. Do not report a clean patchset launch as
proof of the supervisor's Terminal rescue path.

## Current frontier build 22530 — supervised task return

The newest official macOS ARM64 feed offer selected on 2026-10-28 is Desktop `26.1023.51421`
/ build `22530`. The 748,022,821-byte full ZIP passed Sparkle Ed25519 verification, and the
vendor bundle signature, notarization staple, and ASAR seal verified. ZIP SHA-256:
`7642b2ac2a7a0742f9a1800abba15eef83f77e69d893be79d6467cf21e5e1110`.
Pristine ASAR SHA-256:
`1c8ef1bef66e5fc416ae66eff8e6529972aa3601e27a1c7b5f61d6a292b957d3`.
The feed publishes no attached release notes. The selection is the newest feed item, not a
claim about which older item the running application's update badge had cached.

Stock CLI `0.165.0-alpha.1.2` has SHA-256
`d84a54b031085f01e3ad915ea7c72ebea4dcf69e90f0d1e0e4a637e8280991d2`.
Exact upstream source: `720fec862a608ae1e5878d1eecb04fb93192e93c`, tag
`rust-v0.165.0-alpha.1.2`. All three compaction repair files have the exact same before/after
hashes as build `21828`; that predecessor's stock-red evidence is carried by file identity,
not claimed as a new stock run. The catalog applied the exact three-file diff, and both focused
repaired-source tests passed on this revision (2 passed, 2,801 skipped). No experimental retention
feature was enabled. A new same-version release binary is required; the earlier binary is not reused.

Current profiles track the new native terminal dispatcher and simplified sidebar unread state,
shifted archive owners/caches, current readable-family title hook, and actual host-bus singleton.
The Dot guards preserve upstream's new deletion-target revalidation before the request. The
TinRelay classifier preserves upstream's `followsInterruptedFinalAnswer` and history-preview
rules while adding only accepted radio sends. Final readiness still comes from mounted primary
routes, not initialization-only events or overlays. Shared attribution and receipt alignment,
runtime roster policy, and radio scroll anchoring remain unchanged.

The matching stable-Rust `1.95.0` ARM64 release build passed through `bin/tmtk-build-codex`
with LTO off and `RUSTFLAGS`, `CARGO_ENCODED_RUSTFLAGS`, and `RUSTC_BOOTSTRAP` unset.
It reports `0.165.0-alpha.1.2`. Replacement CLI SHA-256:
`658128d1d1d7c5d880d0c00bd29cf77b5b0602ec22ccdad2037bcf4029951a32`.
Cargo.lock changed only 167 workspace version substitutions, with no dependency-resolution change.
All three repaired-source hashes and reverse application verified against the exact upstream commit.

On 2026-10-28, the complete signed 18-patch stage passed composition, changed-module syntax,
byte-identical second application, native payload preservation, executable terminal-helper checks,
signature and ASAR-seal verification, and all probes rerun after repacking. Candidate ASAR SHA-256:
`c0e46dae7711d0ae56abee0ea8fe9ba87bf68c1c6896cb0138a88a623e0d79fe`.
The copied CLI matches the release-build hash. `npm run check`, `npm test`, and `git diff --check`
passed; Linux production package-stage fixtures are platform-skipped on macOS. The source app
stayed unchanged. An earlier stage stopped at a syntax-check subprocess and discarded its partial
candidate. Its Node executable path disappeared during the attempt; the original spawn error was
masked, so that is a likely explanation rather than a captured error code. A focused red/green
regression now requires the actual subprocess error to remain visible. The complete retry passed.

The first supervised `22530` adoption reached renderer readiness and this real task, but sidebar
and room colors failed. Its roster loader incorrectly read imported `pq as Bh`, an initializer,
as the manager atom. Runtime observation showed a null roster and `load-failed` with an undefined
`id` error. The corrected loader uses `mor as qm`, which resolves to stock `mg=Ua(Q,()=>null)`.
The earlier permissive fake store hid the wrong symbol; the new probe follows actual module
imports/exports and enforces manager-atom identity. It failed against the first real bundle and
passes against the corrected, repacked candidate above. The focused transform suite and complete
repository checks/tests passed again. The matching native binary is unchanged.

On 2026-10-28, the corrective `bin/tmtk-restart --candidate` adoption reached primary renderer
readiness at 22:54:17 UTC without rescue. The supervisor finished in `ready` state and removed
its transaction-only rollback. Fresh installed ASAR and CLI hashes match the corrected candidate
and release build above; the installed signature and ASAR seal verify.

The operator returned to this actual chat and confirmed restored roster colors, then accepted the
task-message/wait and TinRelay smoke checks. The recipient returned the requested task-message ACK
after the native wait; an accepted TinRelay self-ping returned through the normal bridge into this
chat. Runtime inspection found 19 roster entries, a null roster diagnostic, room palette backgrounds,
and no model-mismatch indicator present. Transport acceptance alone was not counted as receipt.
This is the current narrow live-accepted macOS target. It is not a new full live feature tour,
terminal-shortcut exercise, scroll stress test, live compaction reproduction, destructive Dot action,
secondary-platform qualification, or provider-acceptance run.

The original source/build and extracted trees were removed after proof (about 12 GiB); the pristine
app restored for this correction and its small owner fixture were also removed. One authenticated
ZIP, one current candidate, the replacement binary input, and compact receipts remain.

## Previous live-accepted build 21828 — supervised task return

The selected official offer is Desktop `26.1021.31345` / build `21828`, macOS ARM64.
The 750,413,801-byte full ZIP passed Sparkle Ed25519 verification. The vendor bundle signature,
notarization staple, and ASAR seal verified. ZIP SHA-256:
`2afcd58e0484a76479cca23174e085127a9d9e63466b75739eb6825a5ff613f4`.
Pristine ASAR SHA-256:
`130145706a912db74e4d260ad7538f10f1e05e88af955f9afba42cdf01e64606`.
The feed publishes no attached release notes. Only Sparkle deltas were cached; none was modified.

Stock CLI `0.164.0-alpha.11.1` has SHA-256
`a04752e4d46a4d89e53e6f61c59c5349a638c8ce172ffbf391fd482b4d902a4e`.
Exact upstream source: `6905ecede7816e91373e9eabda3f6b0368fc747b`, tag
`rust-v0.164.0-alpha.11.1`. Both focused standalone-input tests failed on that stock source,
then passed after the three-file repair (2 passed, 2,798 skipped). The remote-v2 source is
unchanged from the predecessor; local compaction's new annotated-message handling is preserved.
No experimental retention feature was enabled. The catalog checks all three exact before/after
hashes. Cargo.lock changed only 166 workspace version substitutions, not dependency resolution.

This refresh moves roster/palette/attention bootstrap and hotkey dispatch to `app-runtime`,
sidebar actions to `app-primary`, and app-control constants to a dedicated module. That port's
profiles were named `build21828`; older secondary-platform owners remained separate. Dot deletion
and request-time reboot guards retain their behavior; the reboot menu now calls the same policy
across a module boundary. Archive subscriptions use the stock React factory in the sidebar's
actual owner. The registry discovers runtime-owned capabilities rather than silently omitting
them. Receipt names use the current stock readable-family hook. TinRelay preserves the native
history-preview persistence rule and existing finished-turn scroll anchoring. The trusted final
readiness event now comes from mounted routes in `app-primary`, not initialization or an overlay.

The complete stable Rust `1.95.0` ARM64 release build passed through `bin/tmtk-build-codex`
with LTO off and `RUSTFLAGS`, `CARGO_ENCODED_RUSTFLAGS`, and `RUSTC_BOOTSTRAP` unset.
It reports `0.164.0-alpha.11.1`. Replacement CLI SHA-256:
`e53f98b902f1162b799d99b0b181d6144aae0fd95d7872621828b543b49bea88`.

On 2026-10-26 the signed 18-patch stage passed complete composition, changed-module syntax,
byte-identical second application, native payload preservation, executable terminal-helper checks,
signature and ASAR-seal verification, and all probes rerun after repacking. Candidate ASAR SHA-256:
`65579973a74f24a121f7aa4f65b2464fac1954ed919c3744c36eba640ab33431`.
The copied CLI matches the release-build hash. `npm run check`, `npm test`, and `git diff --check`
passed; Linux production package-stage fixtures are platform-skipped on macOS. The three source
before hashes were checked against the exact upstream commit, and reverse application checked cleanly.
The source app stayed unchanged during staging. After proof, its expanded copy, source/build tree,
and extracted ASAR were removed; the authenticated ZIP, one candidate, one current replacement
binary input, and compact receipts remain. No superseded candidate or transaction rollback is retained.

On 2026-10-26, operator-confirmed `bin/tmtk-restart --candidate` installed this candidate at the
canonical application path and reached renderer readiness at 21:51:53 UTC without rescue.
The supervisor finished in `ready` state and removed its transaction-only rollback. Read-only
inspection of the installed application confirms the exact version/build above, a valid signature
and ASAR seal, and the staged ASAR and replacement CLI hashes.

The operator returned to this real conversation and sent fresh requests. A native task-message
test reached the recipient, who returned the requested ACK. The native wait ran and ended when
that reply arrived. An accepted TinRelay self-ping returned through normal bridge delivery to this
conversation. These are current task-return and messaging results, not just a readiness marker.
The legacy dynamic-tool entry point reports that task tools moved to the Codex app MCP server;
the successful send and wait used that current server. No transport or client configuration was changed.

No new full live feature tour, live compaction reproduction, destructive dot action, secondary-platform
qualification, or separate provider-acceptance test was performed. Changed roster/palette, keyboard,
model-loading, archive, and dot seams have the composed causal probes above; this receipt does not
claim they were each independently exercised live.

## Previous live-accepted build 21477

The selected official macOS ARM64 offer is Desktop `26.1016.62342` / build `21477`.
The full 747,146,531-byte ZIP passed its Sparkle Ed25519 signature; vendor bundle signature,
notarization staple, and ASAR seal also verified. ZIP SHA-256:
`b3e8d80bb5ad4f6234216f81e615dbbf043bd9af3774e9fca8be58ee4d0df317`.
Pristine ASAR SHA-256:
`5b5cf52887cfd4de19cb5862155a8ef6cf58830c0a2fc592b72060cfcc3be869`.
The feed has no attached release notes.

Stock CLI `0.163.0-alpha.11.2` has SHA-256
`248ff9873b6fb35124a86bdffa013a09e1bd17f106385124e3dda73e9eb157ad`.
Its exact upstream source is `51f97c6bca5500edbb986f6d9fe64fa2e63cbdd4`.
All three compaction repair targets have the same before/after hashes as the prior
`0.163.0-alpha.11.1` source at `680c4ba93ec79c292287fb9e0b627dc7a76e3b5e`.
The two stock-red tests from that predecessor are carried by exact source identity, not
claimed as a new stock run. The new upstream source delta concerns Windows enterprise-policy
registry loading and MXC sandbox integration, not compaction. No experimental retention feature
is enabled. Both repaired-source tests passed on this exact revision (2 passed, 2,762 skipped).
The stable Rust `1.95.0` / LTO-off release build passed and reports `0.163.0-alpha.11.2`;
the older native binary is not reused. Replacement SHA-256:
`19f64f247e839d455d32ac703da181a052f60d8017f2f003eff83807a74472e0`.
Bootstrap and both Rust flag environment variables are unset.
Cargo.lock changes are only 160 workspace version substitutions;
dependency resolution remains unchanged from this revision's committed lock.

All seventeen desktop-only pristine checks recognized their existing owners. Native integration
correctly refused the prior-version replacement. Full ASAR composition then failed closed on
the outgoing receipt's old shared-module filename. A focused regression reproduced that failure;
the correction changes only the exact current module to `app-shared-fc3316d48427.js` while
preserving its stock `MFt` bus export and store/title hooks. The unchanged generated-owner family
keeps its `21421` profile names; no old filename fallback or new attribution/navigation behavior
was added. All sixteen ASAR patches now pass together, with composed probes, changed-module
syntax, and byte-identical second application.

On 2026-10-23, the complete signed 18-patch stage passed composed probes, changed-module syntax,
byte-identical second application, native payload preservation, executable terminal-helper checks,
signature/ASAR-seal verification, and probes rerun after repacking. Candidate ASAR SHA-256:
`2d93a79ae408bce86d181d07476ffef9bd56e63c345f5f1b3cc6fd2cb572c26c`.
The pristine source stayed unchanged, and the copied replacement CLI hash matches the build above.
`npm run check --silent`, `npm test --silent`, and `git diff --check` passed.
The initial restart stopped before replacement because the existing app did not quit within
30 seconds. A second supervised restart installed this candidate and reached readiness without
rescue; Mike returned to this real task and exercised task messaging and two-way TinRelay.
Outgoing task cards had the correct recipient colors but fell back to task IDs, while wait labels
and incoming attribution resolved names correctly. The title selector is a readable family;
the imported plain signal hook returned that selector object unchanged. The stock family-aware
hook resolves and subscribes to its value. The causal regression now models this distinction:
it failed with `Task bridge-k…` instead of `Bridge Keeper`, then passed after changing the import.
Applied inspection also rejects the wrong hook even when its import exists. No supervisor
implementation or TinRelay transport/configuration was changed.

The corrected complete 18-patch candidate passed composed post-repack probes, byte-identical
reapplication, signature/seal verification, and native payload preservation. Corrected ASAR SHA-256:
`dbbc225ce65af8e6a807a0172c0b50b3deca7ab753b8a58aaaf13fd233ca98af`.
The matching native CLI is unchanged. The full TMTK checks and tests passed again. After one
operator-dismissed confirmation was re-armed, the corrected candidate returned through the
supervisor without rescue and reached renderer readiness at 2026-10-23 08:48:08 UTC. Installed
ASAR and native CLI hashes match the corrected candidate. Mike then verified that a fresh
outgoing task-message card displayed its recipient's name rather than an ID.

Secondary-platform qualification, destructive dot actions, provider acceptance, a live compaction
reproduction, and a full live feature tour were not run. Windows/Ubuntu build `10954` and
Fedora build `9647` keep their separate earlier receipts. Production Linux package-stage fixtures
are platform-skipped on macOS.

The superseded build-`21421` ZIP was removed after the new source authenticated; compact receipts
remain. Disposable source/build/extracted scratch and the accepted loose candidate were removed
after qualification. The supervisor removed its transaction-only rollback. The workbench retains
one authenticated ZIP and compact receipts/logs, not duplicate applications or build trees.

This is a maintainer/porter runbook. An agent installing a patchset that already has an exact
matching qualification receipt uses sections 1, 3, 4, and the patchset portion of section 5. It
must not run section 2 merely to reproduce the maintainer's evidence. Section 2 requires explicit
authority to replace and deliberately break the canonical application, a verified restoration
source, a technical operator present, and a current reason from its invalidation list.

Run from the toolkit repository and record its absolute path as `TMTK_ROOT` before any restart.
Keep an untouched vendor application as `SOURCE_APP`, stage to a new path outside `/Applications`
as `CANDIDATE_APP`, and use the private toolkit configuration as `CONFIG`. Record the exact source
URL or installer provenance, toolkit commit, source-patch commit, version, build, hashes, commands,
and outputs in one dated qualification receipt under ignored `.work/qualifications/` state. After
acceptance, summarize the qualification in the tracked
[`extraction ledger`](../docs/extraction-ledger.md) and a qualification-bearing commit; adopters do
not depend on the ignored raw receipt.

## 1. Prove the complete candidate statically

```sh
TMTK_ROOT="$(pwd -P)"
npm install
npm run check
npm test
node bin/toolkit.mjs inspect "$SOURCE_APP"
node bin/toolkit.mjs stage-macos "$SOURCE_APP" "$CANDIDATE_APP" --config "$CONFIG"
```

The stage must start from a pristine signed vendor bundle, apply every configured patch together,
run every patch probe before and after packing, preserve native payloads and modes, pass a second
application without changing bytes, verify the ASAR seal and signature, and leave the source
untouched. If the fleet includes a rebuilt Codex binary, the receipt must also contain the exact
upstream source commit, patch state, focused Rust tests, release build command, executable hash, and
same-version integration proof.

Adoption into canonical `/Applications/ChatGPT.app` remains an explicit operator action. The
supervisor captures the currently working canonical app before adopting a candidate; do not call a
staged candidate live-qualified before supervised adoption and the remaining phases.

## 2. Qualify supervisor capability when its contract changes

This is a separate capability qualification, not a required destructive exercise for every new
patchset. Re-run it when any of these inputs changes materially:

- supervisor, rescue-runner, stop-hook, handoff, process-quiescence, or platform-adapter code;
- the patched renderer-readiness publication seam;
- the bundled Codex CLI's resume, model-selection, hook, rollout-completion, or state-database
  behavior; or
- the operating-system or terminal lifecycle being claimed as qualified.

A different selection of unrelated presentation or policy patches does not invalidate an existing
supervisor capability receipt. A new Desktop build requires inspection of the readiness seam and
bundled CLI; repeat this section when either relevant boundary changed or cannot be shown
equivalent. Record the capability receipt independently from the patchset receipt.

<!--
This phase is intentionally not an executable acceptance test. A process launched from Codex
inherits CODEX_THREAD_ID and CODEX_SESSION_ID, and those values take precedence over
RESCUE-AGENT.json. An earlier automated fixture resumed the live qualifying task as a second writer
and caused a duplicate-ordinal rollout incident. Do not recreate that automation.
-->

At a witnessed qualification seam, manually prepare two controlled broken forms of the fully
patched candidate. Begin with a verified, working canonical app so the supervisor can capture the
real pre-adoption rollback:

1. **Blank renderer:** fail before the stock React recovery surface can render. Electron may open a
   window and the App Server may initialize, but the healthy route tree never emits readiness and
   no useful recovery page appears.
2. **Living Oops renderer:** throw inside the part of the mounted React tree covered by Codex's stock
   top-level error boundary. Codex must remain alive while visibly showing its stock **ChatGPT hit a
   snag** recovery page.

For each fixture, rebuild the ASAR seal, sign it, inspect it, and record its exact hash and failure
seam. Do not replace or launch it during preparation. The supervisor must perform the real canonical
adoption during each phase; a parallel or isolated launch does not qualify recovery of the
canonical application. A fixture that produces the wrong visible state does not count for the
other case.

Prepare and verify both fixtures before installing either one. Record the ordered phase queue and a
distinct token for each phase in the qualification receipt:

```text
blank renderer -> agent repair -> living Oops x3 -> known-working restore -> healthy launch
```

Before installing the first fixture, show the person the prepared fixture and restoration hashes,
the ordered phase queue, and the actions they will need to perform, then ask once whether to begin.
That authorization covers both controlled fixture adoptions, the blank-renderer repair, three
deliberately exhausted living-Oops repair turns, the supervisor's known-working restore, and the
final healthy launch. When Desktop returns healthy after the blank-renderer rescue, the qualifying
agent reads the receipt and arms the living-Oops phase without asking the person to start it. After
the known-working restore returns, the agent completes the final healthy launch. Stop only for a
failed assertion, unexpected state, or an explicit pause. This is sequential agent-run
qualification across real task continuations, not one automation process: do not automate
supervisor launch or task resume into a competing writer.

For the blank-renderer phase, start the supervisor from the originating Desktop task with the
broken fixture as its candidate. Give the automatic repair turn the exact healthy staged source it
must restore and verify:

```sh
bin/tmtk-restart --candidate "$BLANK_FIXTURE" \
  --prompt "CONTROLLED BLANK QUALIFICATION TOKEN. Restore /Applications/ChatGPT.app directly from $CANDIDATE_APP, verify its signature and ASAR integrity, then finish the turn." \
  /Applications/ChatGPT.app
```

The command must return immediately after arming the detached supervisor and tell the invoking
agent not to poll or wait. The agent finishes its response while a blocking macOS dialog offers
**Don't Restart** and **Relaunch Codex**. On the first run, click **Don't Restart** and verify that
the canonical app remains open, the unused rollback copy is removed, and the recorded phase becomes
`cancelled`; this dialog behavior does not need to be repeated. Arm the same phase again, wait for
the agent's response to finish, and click **Relaunch Codex**. The supervisor must quit the current
app, install and verify the blank fixture itself, and only then launch it.

After the repaired candidate returns healthy, arm the living-Oops phase. This phase deliberately
exhausts the repair ladder so the rollback choice itself is exercised. The qualification prompt
must make that boundary unmistakable to each resumed turn: the correct action is to inspect the
current evidence, verify that the exact controlled fixture remains installed, leave it unchanged,
and finish the turn. Use the living-Oops fixture as the candidate:

```sh
bin/tmtk-restart --candidate "$OOPS_FIXTURE" \
  --prompt "CONTROLLED LIVING-OOPS QUALIFICATION TOKEN. This phase deliberately exercises all three failed repair-and-relaunch attempts. Inspect the evidence, verify that /Applications/ChatGPT.app still matches the recorded Oops fixture, do not repair or replace it during these three attempts, and finish the turn." \
  /Applications/ChatGPT.app
```

After **Relaunch Codex**, the supervisor must capture the healthy canonical app, adopt the Oops
fixture, and launch it. Close the visible Oops application with Command-Q after each launch. Each
exit must open a new owned rescue Terminal for the next numbered attempt; each turn must preserve
the fixture, complete durably, close its Terminal surface, and relaunch without overlap. After the
third failed relaunch, the next rescue Terminal must show the native toolkit choice:

```text
Codex could not be repaired after three attempts.

Restore the last known-working version, or open a terminal line to continue troubleshooting with the agent.
```

Choose **Restore Known-Working**. The supervisor must verify and reinstall the exact app it captured
before adopting the Oops fixture, close the rescue Terminal through the same strict handoff, and
return to healthy Desktop. Record the restored version, build, ASAR hash, signature and integrity,
plus whether readiness came from the real renderer marker or the documented ten-second
known-working fallback. The Oops phase fails if the fallback choice appears before three completed
attempts, if the fixture changes during those attempts, if **Open Terminal Line with Agent** is
selected, or if restoration does not return a usable canonical application.

For the blank fixture, verify that a real application window opens without the stock recovery page
and without renderer readiness, then focus it and quit it with Command-Q. For the living-Oops
fixture, verify that the application remains alive on the stock **ChatGPT hit a snag** recovery
page, then focus it and quit it with Command-Q. In both cases, the process exit—not a timeout—must
open a visible Terminal, announce automatic repair
attempt 1 of 3, say no input is needed, and open the normal colored interactive interface of the
real bundled Codex CLI in the exact originating task and catalogued project directory with the
unique prompt and diagnostic paths already submitted. The person watches but does not type. The
CLI must report the same model and reasoning effort that were recorded for
the task when the supervisor was armed; any mismatch warning fails the phase. Before that resume,
the exact `com.openai.codex` application at the target executable path and the exact invoking CLI
PID recorded from the supervisor's own parent chain must be gone, and the five databases required
by Codex's state runtime must accept a write reservation. Unrelated CLIs, browser extensions, other
app copies, crashpad, renderer, and other helpers must not be classified by name or block recovery.
The supervisor-owned rescue CLI is tracked separately by its exact launched PID. Inherited Codex
task-identity variables must not be allowed to override the task ID frozen when the supervisor was
armed. In the blank phase, the turn must restore and verify the healthy candidate. In the Oops
phase, it must preserve and verify the controlled broken fixture as instructed. Its
invocation-scoped Stop hook must write
a receipt for the exact task and turn, and the supervisor must wait for the matching durable
`task_complete` rollout event before closing the TUI. It must then close its dedicated rescue
Terminal window, quit Terminal when TMTK launched that application, and prove both the CLI process
and owned terminal surface are gone before launching the canonical Desktop application. The new
Desktop must receive real renderer readiness and return the person to the working task without
Terminal input. At no point may the same task be live in both the rescue CLI and Desktop. The
fake-CLI plumbing probe is useful coverage but cannot substitute for this phase.

An Oops page in the blank case, a blank window or process exit in the living-Oops case, wrong task,
wrong directory, wrong model or reasoning effort, missing prompt, wrong or absent Stop receipt,
absent matching durable completion, overlapping main or Codex-writer process, fake CLI,
user-operated repair, parallel application, absent healthy relaunch, owned rescue Terminal surface
left open, or timeout-only rescue fails this phase. Passing either controlled failure does not
substitute for the other.

## 3. Prove this patchset's healthy path

From that same task, run:

```sh
bin/tmtk-restart --candidate "$CANDIDATE_APP" /Applications/ChatGPT.app
```

Wait for the invoking response to finish, then click **Relaunch Codex** in the confirmation dialog.
After Codex returns, require `node "$TMTK_ROOT/bin/did-codex-launch.mjs"` to report `launched: true`,
`phase: ready`, the exact current version/build, and the same task ID, directory, model, and
reasoning effort. Confirm that no rescue Terminal opened. A freshly signed app may wait at a
Keychain prompt; entering the prompt and then reaching renderer readiness is a pass. Any rescue
activation means this patchset failed the healthy-launch gate, even if the supervisor successfully
repairs or restores the application.

## 4. Exercise every selected patch

The qualifying agent reads the exact `enabledPatches` array, works through the corresponding rows
below, and preserves concrete outputs or task references in the receipt. These are intentionally a
mixture of agent-run probes, real inter-task behavior, visual inspection, and person-observed UI.
They are not flattened into one CLI command because the user-facing behaviors need judgment in the
real application.

The qualifying agent owns every observation it can make through the live Codex UI, accessibility
state, screenshots, task tools, files, processes, and logs. That includes reading the macOS menu,
seeing identity chips and selected-room colors, finding and exercising the sidebar disclosure,
opening task links, and inspecting message cards. Do not ask the person to certify those facts just
because they are visual.

Involve the person only when macOS requires a human action, automation would invalidate the test,
the relevant surface is unavailable to the agent, or the remaining question is genuinely
subjective. The agent completes all other setup and inspection first, then batches only those
unresolved questions as one stable numbered list. The person may answer compactly—for example,
`yyny` means yes, yes, no, yes in that exact order. The agent expands the string into the receipt
and names each failed check. Missing answers are not yes. Rows for unselected dormant patches are
marked `not selected`, never passed.

| Patch | Agent-run evidence and setup | Pass condition, including any question for the person |
| --- | --- | --- |
| Cross-task attribution | Send from a named task and receive in another real task; inspect source metadata and open its link. | The real sender name, shortening, link, and optional palette color are correct; unknown metadata remains explicitly unknown. |
| Runtime JSON reload | Make one reversible valid palette save and one invalid save outside Codex, observe, then restore; repeat for attention policy when selected. | Ask whether valid saves applied without restart and invalid saves preserved the last-good behavior. |
| Task visual palette | Inspect configured tasks in a project, Recents or View Activity, and one selected room in both themes. Capture the relevant UI state. | The agent verifies that identity chips exist, are close and aligned, project task names retain stock alignment, and selected accents and sigils appear. Ask the person only for unresolved subjective readability or color-balance judgment. |
| Reasoning retention | Complete a reasoned turn in an opted-in task, send the next turn, then manually collapse and expand it. | Ask whether reasoning remained open across the next turn and manual control still worked. |
| Model identity guard | Pin a disposable exact task, select the wrong model or effort, test session override, then restore the expected setting. | Ask whether `BAD MODEL` flashed, the composer named the expected setting and blocked input, Command-click overrode only the session, and restoration cleared it. |
| macOS menu title | Inspect the leading application menu directly. | The agent records that it says `Codex`; no person confirmation is normally needed. |
| Standalone-output compaction | Record exact upstream source commit and patch state; run focused Rust tests; verify the release executable hash, version, package copy, and source issue reproducer. Exercise a real delegated turn at a compaction boundary when the current qualification can safely induce one. | The current external instruction survives with external provenance and completed historical work does not become authoritative. Do not claim adjacent replay cases that were not tested. |
| Task attention policy | Temporarily mute one exact test task, complete it normally, restore the policy, and separately observe a failure or input-needed state. | Ask whether only the configured ordinary completion stayed quiet while output and exceptional states remained visible. |
| Terminal toggle | Use the configured stock terminal shortcut from the chat composer and from the focused terminal editor. | The agent verifies that it opens from chat and closes from the terminal using the same shortcut; ask the person only if the agent cannot generate or observe the configured key event. |
| Outgoing-message receipt | Send a real cross-task message, inspect recipient, link and body, restart, and paginate away and back. | The agent verifies correctness, ordering, links, restart reconstruction, and pagination survival. Ask only for subjective compactness if it remains uncertain. |
| Wait-thread roster | Wait on at least three real tasks including two named tasks; inspect live and collapsed states; click a known target. | The agent verifies spacing, names, colors, hand cursors, links, and unknown-ID fallback in both states; no person confirmation is normally needed. |
| Tinrelay presentation | Send and receive real messages with Markdown, a fence, and `Show More`; inspect both themes, watch a full wake cycle, restart, and paginate. | The agent verifies text, controls, routes, chronology, reconstruction, animation continuity, and opposite origins. Ask the person only for subjective crispness, visual balance, or motion comfort. |
| Native app-tools peer authorization | From the signed candidate, use native task tools to send, read, and wait on another local task; retain the accepted results. | Real packaged-peer calls succeed. Static authorization probes must still reject unrelated, unsigned, wrong-identity, and non-immediate processes. |
| Codex observability | Run `tmtk-observe list`, capture a short CPU profile and timeline trace from the active renderer while interacting with a real task, then run one read-only CDP command. | Target metadata is current, both output files open in Chrome DevTools, the interaction appears in the captures, and every capture detaches without leaving profiling active. |
| Renderer patch registry | Inspect the packed registry bootstrap and run its composition probe after all selected publishers/consumers. | Exactly one registry exists, known optional capabilities are callable, and cross-task/wait/Tinrelay surfaces above compose without requiring one another. |
| Safe-start readiness | Complete the healthy case in section 3. Re-run section 2 only when its boundary is repaired and deliberately qualified. | This exact patchset writes readiness through LaunchServices without prompting for Terminal Computer Use or network privacy access. On build `10789`, readiness can precede a usable task and living-Oops recovery is not qualified. |
| Computer Use self-target restoration | Record the exact `ComputerUseAllowForbiddenTargets` preference value, bind Computer Use to Codex, and make one harmless read-only accessibility observation. | The stock Computer Use path observes Codex without modifying the signed service. The agent records this as restoration of previously available functionality and verifies no unrelated permission or safety policy was bypassed. |
| Renderer turn window | Run its bounded-turn probe against the packed candidate, then switch into a long-lived real task that previously stalled. | The mounted UI projection keeps only the newest 200 complete turns, transport pagination and transcript export remain intact, and task switching no longer stalls. |

## 5. Close the receipt

The macOS **patchset receipt** is green only when all of these are present for the same
version/build and patch fleet:

- pristine-source inspection and complete static-stage JSON;
- repository syntax and test results;
- source-patch and rebuilt-binary evidence when selected;
- healthy renderer-ready restart evidence with no supervisor activation;
- the current supervisor capability receipt and the comparison showing that none of its named
  invalidating inputs changed, or a newly completed capability receipt when they did;
- the per-patch evidence matrix, with every selected row recorded as a current pass or as
  `carried-equivalent` with its earlier evidence and the current equivalence basis;
- the exact numbered human checklist and an all-`y` expanded answer record for every current human
  check the matrix requires;
- any platform-specific residual risk or intentionally unrun check.

The separate **supervisor capability receipt** is green only when it contains:

- exact toolkit revision, macOS version, terminal adapter, Desktop version/build, readiness seam,
  and bundled Codex CLI version and hash;
- separate real blank-renderer and living-React-Oops evidence;
- for each failure, process exit, visible Terminal, real bundled CLI, exact task/project/model
  resume, bounded automatic repair, durable turn completion, strict no-overlap handoff, owned
  Terminal closure, and healthy Desktop restoration; and
- a healthy supervised launch that does not enter rescue.

One observed healthy restart may be referenced by both receipts when every recorded input matches,
but the conclusions remain distinct: the patchset did not fail, and the supervisor can recover when
Desktop does fail.

Qualification applies only to the recorded macOS architecture, version, build, toolkit commit,
source-patch commit, configuration shape, and selected fleet. Do not generalize it to Windows,
Linux, another Codex build, or a different patch selection.

After recording the accepted receipt, close the bench: delete the staged candidate and unpacked
source, remove superseded release directories, and keep at most one pristine vendor ZIP. Retain a
controlled failure fixture only while the supervisor boundary still needs it; qualification evidence
belongs in the receipt, not in an indefinitely growing collection of application bundles.
