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

## TMTK 0.2.31 — Desktop 30607, protected menus and activity transitions

Accepted target: `26.1120.41243` / `30607`, with 18 default patches or 19 including the optional
Computer Use service repair. Linux and Windows targets are unchanged. The official production
[ARM64 ZIP](https://persistent.oaistatic.com/codex-app-prod/ChatGPT-darwin-arm64-26.1120.41243.zip)
is 662370483 bytes, SHA-256 `ef8aad31409e2ee3993a9e740cf3e94e79e2d7219e50f48adea2217d4acf79d4`.
Sparkle Ed25519, vendor deep signature, notarization and ASAR seal passed.
Pristine ASAR: `e60f32facfaebf94310f18b95e4883799506541356204b9589ac373e192897e6`.
Accepted installed ASAR: `2451195ceb89e827196ef808fa5125d27fe7649728c6f15b70eae88045156024`.

Native startup, transcript, roster and sidebar owners moved. Five lazy tool copies consolidated
into one; both keyboard dispatchers remain, with two native terminal-command catalogs. The new
native browser builder launches packaged Node directly, preserving browser access flags,
confirmation policy and trusted services; the former TMTK parent wrapper is retired.

The existing `protectSidebarArchive` flag now covers permanent deletion in the shared sidebar/title
menu and mixed bulk selections. Actual packaged probes cover protected/unprotected menus, native
eligibility/callbacks, mixed selection and policy changes. No deletion API is changed.

Vendor CLI `0.171.0-alpha.13.2` remains byte-identical to the authenticated source executable:
`e1c3d034b7fd295d160d6ab412357f9c54241c8ed7a2a861f4730b8a4dd88ddb`.
Its source tag peels to `ad9d659a8491fc5169a00dcf7b7e6ca8a87adf69`. Both compaction files match
the previously tested `581161ab41e643d942e1e1b5f561034060bf18e3` source. The actual CLI reports
marked-output retention stable/default-on, and the packaged sender requests it. The local repair
stays dormant; this does not prove general unmarked-output retention or every replay repair.

The optional helper's parent gate relocates to `0x188420`; non-call instructions match the
preceding function. Named symbols identify the same-team/developer-team methods. Normalized stock
image: `ce8e991b5fb75c0154dc6cc09cff5c757021d601b7564d85cb18bd2ff05ae590`; repaired image:
`6f004be22b8b6deaadfff44689d36a5959345171e69373baeddbde827f5be268`.
The canonical helper's certificate-based designated requirement is preserved. The preview used
only codesign; no privacy reset occurred. Bundled app-context fingerprint:
`8644170c39b3e15084036e74dc2b964e008185e3c53245bb4af90df2960f7592`.
Cold resume remains the qualified override-delivery path.

Complete signed 19-patch staging passed: actual packaged initializer/export and native-container
probes, changed-module syntax, byte-identical reapplication, post-repack probes, ASAR integrity,
deep signature and native payload preservation. Three changed startup caches were invalidated;
32 untouched entries/blobs match the vendor. Native-CSS footer checks passed in isolated Chrome
for dark/light themes, transparent edge, solid tail, focus mode and unmapped fallback, preserving
the composer surface. Actual native-CSS shimmer fixtures prove identity paint on base/highlight
copies in both themes. Repository syntax/full tests and hygiene passed; production Linux package
staging fixtures were platform-skipped, while Windows package and Linux adoption fixtures passed.

Live qualification initially exposed two gaps hidden by helper stand-ins: a removed native action
module prevented real-chat load, then a wrong container export broke the wait turn. The final
profiles reuse/pin actual native imports and exports; package probes execute those initializers
and the native container. Further transition probes cover running/completed/failed waits, explicit
identity text-fill under native outer shimmer, and actual send/activity/reply registration order.
The completed TinRelay card now stays inside its source turn, before return activity and the
final reply, retaining existing completion and scroll-ownership flags.

Final supervised adoption reached readiness and opened the real continuing chat. The operator
accepted direct task-message ACK cards, wait rendering/colors and TinRelay send-before-return-
before-reply order after completion/collapse. The self-send was accepted, routed and returned.
Dedicated Chrome extension tab creation, page reading and tab cleanup passed on this installation.
Installed signature/seal and ASAR match the final candidate. Manual protected-menu checks and
native accessibility actions were not repeated; their packaged/earlier evidence remains distinct.
No supervisor algorithm, chat history, credentials or user permission grants changed.

Superseded apps, installers and extracted comparison/source trees were removed. After acceptance,
the loose candidate is removed; one current vendor ZIP and compact receipts remain.

## TMTK 0.2.30 — optional app-context files, cold-resume qualification

Desktop target remains `26.1117.41037` / `29803`; the authenticated official source package is
unchanged from the preceding receipt. Native instruction module 73488 in the shared bootstrap
owns the app-context text; its app-ready caller owns a one-time instruction-change popup.
The optional override is read from the native Codex home on each instruction-generation pass.
A separate default snapshot is refreshed without altering the override. The first startup records
a baseline; later bundled text changes notify once after acknowledgment.

Actual packaged-builder probes resolve packaged Node externals and use isolated temporary Codex
homes: missing-file output matches the native builder byte for byte across eight feature/hosted
combinations, overrides stay
literal, empty/removal behavior works, snapshots remain native, and custom files stay unchanged.
Startup notice tests cover first-run establishment, unchanged defaults, changed text, acknowledgment
and failed-notice retry. Pure transform tests cover minifier-independent text fingerprints,
unknown/partial-owner rejection and byte-identical reapplication. No real profile or chat was
changed by these probes. The actual native app-ready call passed a readiness-order and
nonblocking-popup probe against the final repacked candidate.

Complete signed 19-patch staging passed: composed/post-repack probes, byte-identical reapplication,
native payload preservation, signature and ASAR seal. Candidate ASAR SHA-256:
`cad823a95b1a26297daeb4657a554df32c0a577d4fe59ed5a8d1faad7d6f93d1`.
Stock CLI bytes remain unchanged. Four startup bytecode entries were invalidated; 26 untouched
entries and blobs match the vendor package. The native helper retains the same certificate-based
designated requirement; the preview made no privacy reset. `npm run check` and `npm test` passed.
Windows package and Linux adoption fixtures passed; production DEB/RPM staging fixtures were
platform-skipped.

The first supervised adoption reached renderer readiness but real-chat resume failed. The helper
incorrectly used crypto's binding as fs; the initial probe had injected fs under that name and
therefore missed the error. The regression probe reproduces the failure with the actual packaged
externals; the helper now uses the existing fs binding. The original candidate hash above is not
an accepted build. Corrected full 19-patch staging passed with post-repack probes, byte-identical
reapplication, signature/seal and native preservation. Corrected candidate ASAR SHA-256:
`7a6825ad28fe2a8d8e66287bcb36c5fd733aaf2f9676f9b573f90a44a8ccea1f`.
Only the native instruction helper JavaScript differs from the failed installed candidate.

Corrected supervised adoption reached renderer readiness without rescue and returned to the real
continuing chat. Installed ASAR matches the corrected candidate, with valid signature/seal.
The first-run state and native default snapshot were generated successfully; no override existed
at launch. The override was then created from the generated default with a narrow instruction
change. Ordinary messages in an existing loaded chat did not deliver the replacement block.
Inspection of the packaged resume path found an idle-thread reuse branch that omits fresh
developer instructions; a refreshed default snapshot alone does not establish delivery.

The operator subsequently confirmed that a full app quit/relaunch and reopening the same
continuing chat delivered the intended guidance. This qualifies cold-resume custom instruction
delivery, not hot reload into loaded sessions. No replacement chat, history surgery or scheduler
action was needed. A visible changed-default popup remains covered by isolated tests, not a live
observation. Messaging/browser owners are unchanged and retain the preceding receipt's evidence.

## TMTK 0.2.29 — build 29803 live qualification

The official ARM64 appcast offers Desktop `26.1117.41037` / build `29803`, published
November 20 at 22:47:19 UTC. Full ZIP: `724006681` bytes, SHA-256
`bc0a42d01a9bdede1c1c2b876151a818560d6b1eaf1f45ae402d3d2229c34220`.
Sparkle Ed25519, vendor deep signature, ASAR seal and notarization staple passed. Pristine ASAR:
`b9e516de7c5ef608bf83a6313c815f5a7ef8819e4f08aef04c69744ecfc59cf8`.

The bundled CLI `0.171.0-alpha.13` is byte-identical to 29513, SHA-256
`3b6d00deea5fabc50ad34be1872b8e4ead1638d23c68fabb7837edc07f0cf1e0`.
The actual packaged delegation sender/version gate passes for send/create. Retention remains
stock-owned under the preceding receipt's exact-source proof; no Rust build or local CLI repair
was repeated. The optional Computer Use helper has the same normalized stock image
`42d72ddbe3d1b9fa46e1d15f282ffbd1d109f9624249c9f0ac0bc232c012d0ac`.
Its exact instruction repair and designated-signing contract are unchanged.

The main loader now binds module 17408. The shared chat module splits into qGHI, CrhD and toTV;
the common transcript's bindings and one lazy tool copy's bus alias also change. Exact profiles
follow those owners without broadening matching. Five classifier/tool copies, both dispatchers,
actual packaged exports, task-label hydration, receipt persistence, reasoning/manual-collapse
policy and the pre-deferral TinRelay history wrapper pass composed probes. Native output deferral,
activity-key source ownership and non-following receipt entries retain the accepted behavior.

Complete signed 18-patch staging passed: composed and post-repack probes, byte-identical
reapplication, native payload/executable preservation, signature and ASAR seal. Candidate ASAR:
`974fe0e75e59a94ffc8c4b79ce0695c4bcbd13c7c185d87d4862158cdc554bbb`.
The default 17-patch stage also passed before its candidate was replaced by the local 18-patch
variant. Four patched startup Owl cache entries were removed; 26 untouched entries and blobs
remain byte-identical. The stock CLI executable is preserved. The helper preview performs only
codesign inspection and confirms the existing certificate-based designated requirement; it
cannot reset privacy grants. An isolated browser using this package's native CSS passed footer
dark/light colors, transparent edge, native stop geometry, solid tail, focus surface, unconfigured
rooms and composer isolation.

`npm run check` and `npm test` passed, including Windows package and Linux adoption fixtures.
Production DEB/RPM staging fixtures were platform-skipped. No guest qualification was attempted.
Mike authorized supervised adoption. The supervisor reached renderer readiness without rescue
and removed its transaction-only rollback payload. The real chat is usable. Installed Desktop
29803 matches the qualified candidate ASAR above, with valid deep signature and seal. A fresh
task message reached Vera, her BUILD29803-ACK returned, and wait reported turnCompleted with
no error. A fresh TinRelay self-send was accepted, independently reported routed, and returned
to this chat. Read-only inspection of the actual mounted chat found both matching outgoing and
incoming cards rendered in the viewport. No forced compaction was attempted. Browser/native
actions were not repeated for this package; unchanged helper ownership retains the preceding
receipt's bounded evidence. No privacy reset or new signing identity was selected.
The adopted loose candidate was removed; one official ZIP, installed app and compact receipts remain.

## TMTK 0.2.28 — build 29513 accepted

On November 20 the newest official ARM64 appcast item was Desktop `26.1117.31558` / build
`29513`, published at 01:45:31 UTC. Full ZIP: `723988688` bytes, SHA-256
`2e6927203a93e4e5238ff0411d11fd6ed23cb97a0e6b03b10e403f30d02e2d37`.
Sparkle Ed25519, vendor signature, ASAR seal and notarization staple passed. Pristine ASAR:
`97f9f40a31a1512cca57c0e06fedc568642a8f84a10abc637d96ffeca3f5e6ac`.

The bundled CLI is `0.171.0-alpha.13`, exact upstream
`581161ab41e643d942e1e1b5f561034060bf18e3`. Its unchanged executable SHA-256 is
`3b6d00deea5fabc50ad34be1872b8e4ead1638d23c68fabb7837edc07f0cf1e0`.
The actual packaged sender (`KBsB.on`) now marks send/create outputs `retain: true` after the
native version-capability check. The matching core feature is stable/default-on, also confirmed
by the bundled binary's feature listing. Both exact-source stock tests passed: marked delegation
stays after initial context in a fresh window and survives remote-v2 compaction. Two passed,
3071 filtered out; only test source was added. Cargo.lock changes were limited to 174 own-workspace
version pairs. Rust 1.99.1, LTO-off test compilation passed; no repaired CLI was built or selected.
The prior compaction source/integration patch is dormant for this macOS target and retained as an
inactive reference. This is not a general unmarked-output or consumed-input replay guarantee.

Exact renderer profiles cover five lazy tool/classifier copies, both keyboard dispatchers, actual
packaged imports and the common transcript owner shared by native and MCP turns. Receipt and
TinRelay entries cannot take latest-turn scroll ownership. The current composer footer retains
its room token. An isolated browser using this package's footer CSS passed dark/light colors,
transparent edge, native stop geometry, solid tail, focus surface, unconfigured chats and composer
isolation.

This package introduces 30 optional Owl CommonJS bytecode-cache entries. Their manifest digests
match cache blobs, not source text. Static inspection of the native lookup identifies a cache-miss
path. Staging removes only the four entries/files corresponding to patched startup sources;
the remaining 26 are verified byte-identical after repacking. A signed-stage regression first
failed with stale bytecode retained, then passed after invalidation. Subsequent supervised startup passed; static probes alone do not establish renderer usability.

Computer Use normalized stock image:
`42d72ddbe3d1b9fa46e1d15f282ffbd1d109f9624249c9f0ac0bc232c012d0ac`;
repaired image: `9bc007422c0df270861eda24321a0d8131e204f93226d825081d724dc43427f5`.
Parent gate `0x1807b4`, same-team requirement `0xde7178`, developer-team `0xde70e8`.
Private-socket proof: stock rejects vendor Node, repaired answers IPC-v5 ping, unsigned Python
remains rejected. Candidate and existing helper designated signing requirements match under the
persistent local signer. The preview performs codesign inspection only; no privacy reset occurred.

Complete signed 18-patch staging passed, including post-repack probes, byte-identical second
application, native payload and executable-mode preservation, signature and ASAR seal.
Initial candidate ASAR SHA-256:
`cd8030724673ad6b7675eb9aef7362bb147479f30826e6f3bd88e2cc4714bd2b`.
`npm run check`, `npm test`, Windows package fixtures and Linux adoption fixtures passed;
production DEB/RPM staging fixtures were platform-skipped. The default macOS example has 17
patches; this receipt includes the optional Computer Use repair as the eighteenth.

Mike then authorized supervised adoption. The installed build is now `29513`, with valid
signature/seal and an ASAR exactly matching the qualified candidate. This actual chat is usable.
A task message through the current Codex app MCP tools reached its recipient, the requested ACK
returned, and wait reported `turnCompleted` with no error. The older dynamic app-tool alias reports
it is unavailable and redirects callers to the MCP server; its failed call did not submit a message.
A TinRelay self-send was accepted, independently inspected as routed, and returned to the actual
chat. These are transport checks, not a controlled live compaction test. At that point the current
Chrome/Computer Use checks had not yet run; their final results appear below.

Mike then reported that only the incoming TinRelay card appeared. The outgoing observer event
exists, but the source-turn presentation anchor was not established. The build-29513 exec wrapper
had stale `t$`/`e1` references instead of the current `tF`/`e0` bindings, and omitted native disclosure
scope. A probe evaluating the actual packaged props expression reproduced `ReferenceError: t$ is
not defined`. Preserving the native hide-command, activity-key and disclosure inputs made the
probe pass. This corrects the profile without changing transport, lookup, persistence or scroll
policy. The corrected complete signed 18-patch stage and post-repack probes passed; corrected
candidate ASAR SHA-256:
`3145c6fdbf455a608bc7e2e3e79e8f97ff02b46f06c55b7d7c39d2f2a8e6f2ce`.
That variable-binding correction was adopted through the supervisor. Its fresh self-send again
returned, but the outgoing card and source-turn anchor were absent. Read-only inspection of the
mounted renderer found 137 bytes of acceptance output at `fw8Z.C`/`fw8Z.A`, while downstream
`z9Cz.ak` received an empty deferred-output shell and no direct turn ID. The native activity key
still contained the correct conversation and turn. The binding-only fix was insufficient.

The final correction wraps the original history item before native output deferral, derives source
ownership from that native activity key, and leaves the deferral, command props and scroll policy
intact. A probe executing the actual history wrapper with the observed input shape fails on the
installed artifact and passes on this correction. Complete signed 18-patch staging, post-repack
probes, reapply identity, native preservation, signature and seal passed. Final staged candidate ASAR:
`1378768737230d73136b8a7defeca2c478a70c71b5129fe83a38b50b065e44ab`.
Mike authorized another supervised restart. The installed ASAR now matches the final `137876...`
candidate, with valid signature and seal. A fresh TinRelay self-send was accepted, independently
reported routed, and returned to this actual chat. Its source-turn anchor exists. Read-only
inspection also finds the matching outgoing card rendered in the current viewport. Mike confirmed
that it works and authorized the source checkpoint and push.

Final live browser/native checks passed on this installed build: dedicated Chrome control created
a temporary public example-page tab, navigated/read it and closed it. Native Computer Use retrieved
the canonical Codex app's accessibility state. No new permission flow or privacy reset was needed.
The canonical app was addressed by full path because the still-present staged candidate shared its
bundle identifier. Pixel capture and input were not exercised. The accepted loose candidate was
then removed; the installed app, one official ZIP and compact receipts remain.

## TMTK 0.2.27 — composer-footer correction accepted

The Desktop build remains `28661`. Before the correction, read-only renderer inspection
found the colored room at `#1E1B29` while the current footer's pseudo-elements still resolved to
the native `rgb(30,30,30)` surface. No active footer carried the palette marker. The actual footer
is in `Jg9v`; the previous patch tagged only the older `KkZX` fade component. The report alone
and this current package do not establish which earlier release first diverged.

The correction tags the current footer and supplies its room token locally to its pseudo-elements.
It preserves native positioning, fade geometry, transparent edge and child composer controls.
The focused package probe fails on the pre-fix artifact. An isolated headless Chrome check using
the native footer CSS fails on that artifact,
then passes on the corrected candidate for dark/light gradient endpoints, transparent edge, native
stop geometry, solid tail, focus-mode surface, unconfigured chats and composer-surface isolation.
Complete signed 19-patch staging, post-repack probes, byte-identical second application, native
payload preservation, signature and ASAR seal passed. Candidate ASAR SHA-256:
`ca0cf37b0c5e7fd2201eba79961b4ea0c96963ba31d61966444ab86f53345b6b`. The helper signing requirement remains preserved without a privacy reset.
`npm run check` and `npm test` passed; production DEB/RPM stage fixtures were platform-skipped.
Mike then authorized supervised adoption. Renderer readiness was recorded at
2026-11-18 15:10:21 UTC. He reports the footer looks much better and explicitly accepts the
qualification. The installed ASAR matches the candidate hash above, with valid signature/seal.
The correction changes only palette footer tagging/styling; CLI/native and task/radio logic are
unchanged, so their already-accepted checks were not repeated. Transient extracted/pristine apps
and the supervisor rollback were removed; one official ZIP, one current candidate, the existing
matching CLI and compact receipts remain.

## Build 28661 — corrected adoption accepted

On 2026-11-18 the newest official ARM64 feed offered Desktop `26.1111.71025` / build
`28661`, published 2026-11-17 22:01:36 UTC. Full ZIP: `835838478` bytes; SHA-256
`7edb7f133e41d947a9e11826f3669fd32be2ff6c6bbdaa01e40eb41b9e39e957`.
Sparkle Ed25519, vendor signature, ASAR integrity and notarization staple verified.
Pristine ASAR SHA-256: `8e84a27e1cade4406a60854d2ae850e330d1de5c3dab5627b2a95c76fe685284`.
The newest feed was checked beyond a lagging/busy updater; no updater cache was modified.

Bundled CLI `0.169.0-alpha.11.1`, upstream
`226fa88979b1a9d76dc36f339ee9c5fbdb2c8e7f`, has stock executable SHA-256
`3ea20787e106af94573d3d6c19480aed93a1334b0dd32b6b04e2f780ce82cf4b`.
Both focused local and remote-v2 compaction regressions failed on stock and passed after repair;
3011 other core tests were filtered out. No authentication-fixture correction was required.
Native Rust `1.95.0`, LTO-off release build passed (19m19s). Replacement ARM64 executable:
`409961240` bytes, SHA-256
`6432f14130e05a2d82a010d6560b48e8e08dc9c8606266d2b1b6c3fec43af761`.
The delegation adapter still omits retain; the new pending-agent-mail path is a separate input
shape. No experimental flag was enabled. This proof does not qualify wider handled-input replay.

Computer Use normalized stock image:
`01b77165a1552527293a07aa11eefd24c1aeebea9303b409ff137330ac51c0fb`;
repaired image: `9225430fe5357786cf2a2dcf8cc864d0bffc801d119c32cf6be5f6570f4f3b6a`.
Exact parent gate `0x180540`, same-team `0xde2de4`, developer-team `0xde2d54`.
Private-socket proof: stock rejected vendor Node, repaired answered IPC-v5 ping, unsigned Python
remained rejected. The existing persistent signer and private socket policy are unchanged.
Candidate and existing helper designated signing requirements match; the preview used codesign
inspection only, without a privacy reset.

Renderer profiles cover three lazy tool copies, both keyboard dispatchers and both transcript
paths. Outgoing previews adapt the stock compound tooltip API and resolve the native formatter
at render time. The secondary keyboard dispatcher's editable-focus probe failed before its
correction and passed afterward. Complete signed 19-patch staging, composed/post-repack probes,
byte-identical second application, native payload preservation, executable Terminal helper,
signature and ASAR seal passed.

The first supervised adoption failed before renderer readiness with
`MTKattentionDecode is not a function`. The barrel no longer exports `DBCl.Pc`; native badge
handling uses `d6Ff.Pc`. Both attention and palette imports selected the removed re-export.
A new regression resolves the actual packaged decoder before exercising these policies; it
reproduces the undefined binding and passes after correcting the two imports. The rescue repacked
and re-signed the candidate and installed app, preserving all native unpacked bytes and flags.
Corrected installed/candidate ASAR SHA-256:
`5025bbda64fbba7174dddd6f7a5ce5e49dd11d999c859d76014c36399055309e`.
Both signatures and ASAR seals verify. The final source reproduced this exact accepted ASAR from the pristine vendor package before
commit. Its complete signed 19-patch stage, corrected decoder preflight/regression, post-repack
probes and byte-identical reapplication passed. `npm run check` and `npm test` passed after the
correction; production DEB/RPM staging fixtures were platform-skipped.

The supervisor subsequently recorded renderer readiness at 2026-11-18 14:34:50 UTC. Mike reports
this real chat opens normally. A native task message reached its recipient across compaction,
the ACK returned here, and the explicit wait completed without error. A fresh TinRelay self-send
was accepted, independently inspected as routed, and returned through the bridge to this chat.
No retry or manual routing mark was used. Mike explicitly accepted this qualification and
authorized commit/push on November 18. This successful compaction case is separate from the
controlled source regressions and does not establish general replay prevention.

Current Chrome/native Computer Use actions, screenshots/input and a full feature tour were not
rerun for this build. No broader live result is claimed. Transient source/extracted apps, module
captures and Rust build trees are disposable; retain one official ZIP, one current candidate,
the matching CLI and compact receipts. Other platforms' qualification remains unchanged.

## Build 26605 — corrected adoption and bounded live checks passed

On 2026-11-11 the newest official macOS ARM64 feed offered Desktop `26.1106.51428` / build
`26605`, published at 02:34:53 UTC. Full ZIP: `820584997` bytes, SHA-256
`959adaad0a8b8cd0265ca1a53835af61827e2eaf659fd2bdad7ce39b712f257c`.
Sparkle Ed25519 signature, vendor app signature, ASAR seal and notarization staple verified.
Pristine ASAR SHA-256: `3695c17edcab8d66c1e5f2faa03e07826a59a39bf78b369ec87854547d4843c1`.
The feed supplies no release notes. Last accepted app was `25679`; the preceding
statically qualified `25894` candidate was not adopted and is superseded.

The first `26605` candidate passed static proof and reached startup renderer readiness, but opening
a populated real chat failed. The captured exception points to the outgoing receipt initializer
requiring removed module `CqQF`. Its replacement is stock hover owner `CxEf` in the current shared
chunk. The new binding probe checks real packaged exports before supplying test dependencies.
Additional causal probes expose and repair a renamed archive-menu argument and a mismatched
incoming-bubble memo dependency. This is a failed first adoption, not live patchset acceptance.

Bundled CLI `0.167.0-alpha.4.1` has stock executable SHA-256
`7cb8700a47be3c81bb3c5efbf2d2adc716ce3db4806e9dc992f2925f78b2b194`.
Exact source is `d2c035639366e0bf2c316aa2065c24aabc12bcdc`. Both focused local/remote-v2
compaction regressions fail on stock production code. A missing `reauth` argument in one upstream
auth test fixture first prevented the library tests from compiling; the same test-only `false`
argument correction is used for stock and repaired runs and is included in the current source
diff. It changes no production authentication. Both repaired tests and the Rust `1.95.0`, LTO-off native release build passed.
Replacement executable SHA-256: `dfa39a27f26c0e5f8d088bdf5fabea85e5cce04d86684bced6a5296ac72972b4`. The packaged delegation adapter still omits `retain`; no
experimental flag was enabled. Live compaction is not qualified.

Computer Use helper vendor executable SHA-256:
`1a268283d5a016751ac037dd670d4086534eb1a66d300bdc7c8ca0c7007d4c51`.
Normalized stock image `b25766b347c724525d472958bb5193f8221c828205ca503b98bd4ec76481507d`;
repaired image `23a4f452bc23b129334675f046aff2cd6605c8be8f0a30c6bf28070e350c28d6`.
The parent gate retains its exact owner; the SlimCore same-team/developer-team functions moved.
Current private-socket causal probe: stock rejects vendor Node, repaired responds to its version
ping, unsigned Python remains rejected. Persistent local certificate unchanged. No privacy grant
or canonical helper was changed. Final candidate and existing helper have identical designated
signing requirements; the preview invoked no privacy reset. After adoption, native Computer Use
successfully read Chrome's window, page and controls without another consent flow.

The renderer module/chunk layout, imports, native main/bootstrap and transcript memo caches
changed. All 16 pristine ASAR preflight checks, composed behavior and changed-code syntax probes
passed. Complete signed 19-patch staging, post-repack probes, byte-identical second application,
native payload preservation, signature and ASAR seal passed. The source app was untouched and
neither staged app was launched during static proof. First candidate ASAR SHA-256:
`9906ce4016b35dcf34fdf51db63fbe493c596b8e41ec8534a9fc3699d257b7f1`.
The corrected candidate repeats complete signed staging with the three new causal probes passing
before and after repacking, byte-identical reapplication, and preserved helper signing identity.
Corrected ASAR SHA-256:
`bfd8dde9f6cb97c22cfb90deb79baddcc2d1097de5dbdd68df0edb3555ed7ce7`.
The staged CLI is byte-identical to the replacement executable above. `npm run check`,
`npm run check:current` and `npm test` passed; production DEB/RPM stage fixtures were platform-skipped.
The two selected Rust regressions passed; the other 2909 library tests were not run.

The corrected candidate was adopted through the supervisor on 2026-11-11; readiness was recorded
at 08:06:54 UTC after observing the invoking escape-line CLI exit. Installed ASAR matches the
corrected candidate above, with valid signature and seal. The operator reports the real chat works.
A native task message reached the recipient's actual chat and its ACK returned after a wait.
The TinRelay self-send was accepted, independently reports routed, and returned through the bridge
to this actual chat. These are transport/runtime results; outgoing-card appearance still relies
on operator observation. A fresh native Computer Use binding to Google Chrome returned the active
window's accessibility tree, including page and toolbar controls, without a new consent flow.
The separate `chrome` browser-provider binding was unavailable; native app access was successful.
No input was sent or page changed. Live compaction, screenshots/input control, separate
browser-provider, full feature tour and secondary-platform runs are not claimed.

### Dedicated Chrome launch repair — adopted and live tab control passed

The Chrome extension host independently checks the browser REPL's parent identity. Its current
unmodified binary rejects a vendor Node client directly under the locally rebuilt CLI. Keeping
packaged vendor Node as the client's immediate parent produces an extension handshake response;
an unsigned Python child remains rejected. The exact production launcher passed this causal probe.
The build26605 configuration generator now supplies that launcher using stock runtime paths.
No Chrome-host binary, manifest, profile or authentication-policy change is required.

The resulting 19-patch candidate passed full signed staging, composed/post-repack probes and
byte-identical reapplication. Launcher tests cover binary stdio, executor environment, parent PID,
exit status and SIGTERM without an orphaned child. Candidate ASAR SHA-256:
`f76fb77c5b5b8f9d874ec2422299baa2bc9a5b1887ffbf226a4c1f3b001bd600`.
This supersedes the loose corrected candidate above, not its recorded live evidence.
`npm run check` and `npm test` passed with the new launcher and current-profile regression fixture.
The permission preview reports the existing helper signing identity preserved, without invoking a
privacy reset. Staged CLI bytes match the qualified replacement above.

The supervisor recorded readiness at `2026-11-11T08:44:41.402Z` and removed its transaction rollback
payload. Fresh installed inspection matches this final ASAR hash, with valid signature and seal.
The operator returned in the actual chat. Dedicated CUA browser inventory now exposes Chrome as
an `extension` backend. Through that backend, a new disposable tab navigated to
`https://example.com/`, returned the expected title and page DOM, then closed; the owned-tab list
confirmed its removal. The operator confirmed the normal Chrome session appeared. This is live
dedicated Browser Use evidence, separate from the earlier native accessibility read. No new
permission flow, Chrome restart, host replacement or authentication-policy change was required for
this adoption. Native screenshots/input, live compaction and a full feature tour remain unqualified.

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
| Computer Use self-target restoration | Record the exact `ComputerUseAllowForbiddenTargets` preference value, bind Computer Use to Codex, and make one harmless read-only accessibility observation. | The preference restores only the Codex target policy. Record whether the separate service authorization repair is selected; neither result substitutes for this self-target observation or for macOS consent. |
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
