# Linux desktop qualification

This runbook qualifies one exact Linux Codex Desktop package, desktop/session, architecture, and
TMTK patch fleet. It has two conclusions that must remain separate:

- **DEB patchset qualification** proves the pristine package, local rebuild, selected transforms,
  installation, and healthy supervised launch.
- **Linux supervisor capability qualification** deliberately exercises blank-renderer and living
  React-Oops failures, rescue-terminal ownership, strict CLI/Desktop non-overlap, and known-good
  package restoration.

The DEB adapter has completed healthy supervised adoption from a real Codex task on Ubuntu ARM64
build 9275. Runtime roster reload, palette surfaces, model mismatch protection, sidebar collapse,
cross-task attribution, observability, and the live patch registry also passed on that exact build.
Every selected live feature fixture passed except the explicitly accepted greater-than-200-turn
switching exercise; its deterministic and packed-candidate probes passed instead. The unchanged
failure/recovery phase was deliberately not rerun and remains separate capability evidence, not
live evidence for this exact candidate. Do not report Linux as generally qualified from this
bounded result. RPM is outside this runbook and remains unsupported.

Run from the Linux toolkit checkout. Keep the official DEB untouched, stage to a new file, and
write exact commands and results to a dated ignored receipt under `.work/qualifications/`.
Start the exact build-9275 16-patch selection from
[`toolkit.linux.example.json`](../toolkit.linux.example.json), replacing its one remaining
operator-specific `tinrelay.client` value in an ignored private copy.

## 1. Freeze the environment and identities

Record the full output of:

```sh
TMTK_ROOT="$(pwd -P)"
cat /etc/os-release
uname -m
printf 'desktop=%s\nsession=%s\nsession_type=%s\n' \
  "$XDG_CURRENT_DESKTOP" "$DESKTOP_SESSION" "$XDG_SESSION_TYPE"
dpkg-deb --field "$SOURCE_DEB" Package Version Architecture Maintainer Installed-Size
sha256sum "$SOURCE_DEB"
ar t "$SOURCE_DEB"
gpg --show-keys --with-colons /usr/share/keyrings/chatgpt-archive-keyring.gpg
node bin/toolkit.mjs inspect /usr/lib/chatgpt
dpkg-query --show --showformat='${Package}\t${Version}\t${Architecture}\n' chatgpt
```

The package must be `chatgpt`, its architecture must match the VM, and the installed app must match
the pristine DEB's inner version, build, ASAR hash, executable hash, and bundled-CLI hash. Record
the exact source URL or installer provenance. Staging and adoption must verify the embedded origin
signature with `gpgv` against this already-installed trusted APT keyring; `_gpgorigin` presence by
itself is not authentication. A key rotation that the installed keyring does not yet trust must
fail closed until the keyring is refreshed through an independently authenticated OpenAI
APT/vendor path. Record whether the session is X11 or Wayland; a pass
in one is not evidence for the other.

## 2. Prove the candidate statically

Install repository dependencies without changing the vendor package, then run:

```sh
npm install
npm run check
npm test
node bin/toolkit.mjs stage-deb "$SOURCE_DEB" "$CANDIDATE_DEB" --config "$CONFIG"
dpkg-deb --field "$CANDIDATE_DEB" Package Version Architecture Maintainer Installed-Size
sha256sum "$SOURCE_DEB" "$CANDIDATE_DEB"
ar t "$CANDIDATE_DEB"
```

The stage result must be `staged-deb-static-proof-green`. It must say the source was untouched,
the second application was byte-identical, post-pack probes passed, native payload was preserved,
and nothing was installed or launched. Record the outer candidate identity, inner application
version/build, ASAR hash, executable and CLI hashes, selected patches, and changed generated files.
The candidate must not contain the vendor `_gpgorigin` signature member and must identify itself as
a local TMTK rebuild.

Read-only checks for every active transform must be retained with the receipt. A transform that
does not recognize the exact Linux generated-code owner stays unsupported; do not widen matchers to
turn a red inventory row green.

## 3. Healthy supervised adoption

Start from the Desktop task being preserved. Confirm that the current installed app is healthy,
that `KNOWN_GOOD_DEB` reproduces its exact installed identity, that the candidate receipt names the
pristine `SOURCE_DEB`, and that no other task will be surprised by a restart. On the qualified
Linux Desktop build, the initiating task also had to be set explicitly
to **Full Access** before arming. The ordinary **Ask for approval** sandbox made
`~/.codex/tmtk-rescue` read-only, and an invocation-scoped escalation request was rejected. Explain
to the person that TMTK needs to write private supervisor state outside the project, survive the
Desktop/task exit, and install the authorized package; never enable Full Access silently or treat
it as incidental. Re-check this product boundary on later builds rather than assuming it is
permanent. Then arm adoption:

```sh
bin/tmtk-restart --candidate "$CANDIDATE_DEB" \
  --candidate-source "$SOURCE_DEB" \
  --known-good "$KNOWN_GOOD_DEB" /usr/lib/chatgpt
```

After the command says the supervisor is armed, finish the invoking turn. The operator clicks
**Relaunch Codex** in the selected native dialog. Record which backend was used (`kdialog`,
`zenity`, or `yad`) and whether its affirmative and cancellation labels were correct.

The receipt must prove:

1. the exact invoking bundled CLI ancestor was frozen before Desktop quit;
2. the exact `/usr/lib/chatgpt/ChatGPT` process quit and no name-based process kill occurred;
3. the state databases accepted a writer before package installation;
4. an ordinary user authenticated through the selected native askpass dialog and exact
   `sudo -A dpkg --install`, or the supervisor was already root;
5. `dpkg-query` reports the local candidate version and architecture;
6. the installed app matches the candidate's inner version/build and three payload hashes;
7. the directly launched Desktop process reached the one-use renderer readiness marker; and
8. the selected live patch surfaces behave as their patch READMEs require.

Record `/proc/PID/exe` for the launched main process. A green static probe does not substitute for
the selected feature checks in the real renderer.

## 4. Qualify supervisor failures when its Linux contract changes

This phase deliberately installs broken packages. It requires an operator present, explicit
authorization for the complete ordered exercise, the already-verified pristine DEB, and two
controlled candidate DEBs whose failure seams and hashes are recorded before either is installed:

```text
blank renderer -> agent repair -> living Oops x3 -> known-good restore -> healthy launch
```

The blank fixture must fail before the stock React recovery surface can render. The living-Oops
fixture must remain alive while visibly showing Codex's stock **ChatGPT hit a snag** page. Each
fixture must be a complete local DEB with a valid TMTK receipt naming the same pristine source, not
an in-place edit under `/usr/lib/chatgpt`.

For each phase, arm `tmtk-restart` with `--candidate BROKEN_DEB`,
`--candidate-source "$SOURCE_DEB"`, and `--known-good "$SOURCE_DEB"`. These controlled fixtures
are same-build replacements, so the one pristine DEB truthfully fills both vendor-package roles.
Record the incident token and state transitions. The evidence must show:

- early exit or missed readiness opens the selected Linux terminal emulator in the recorded
  project;
- the rescue terminal runs the exact bundled CLI and the same task/model/reasoning selection;
- automatic repair attempts finish through the matching Stop receipt and durable task-complete
  event;
- the rescue process exits before Desktop relaunch, with no interval in which the same task is
  live in both the CLI and Desktop;
- the emulator's `--wait` or equivalent process returns when the rescue command ends and no
  toolkit-owned terminal remains;
- three exhausted living-Oops repairs offer the native **Restore Known-Working** choice;
- restoration re-verifies and installs the private `known-good.deb` through dpkg;
- `dpkg-query` and the installed inner hashes return exactly to the pristine package; and
- the restored vendor app either emits readiness or remains cleanly alive through the documented
  ten-second pre-marker fallback, followed by a separately recorded healthy patched launch.

An invisible or unbranded password prompt, premature terminal, terminal that cannot wait for its
command, unverified diagnostic path, package-script failure, process overlap, or application
identity drift is a failed qualification, not an instruction to weaken the adapter.

## Build 9275 Ubuntu ARM64 checkpoint

On 2026-09-16, Ubuntu 24.04.5 LTS ARM64 in a GNOME Wayland session qualified the official
`chatgpt` DEB version `26.908.70816` and the 16-patch local package
`26.908.70816+tmtk1`. The pristine DEB SHA-256 was
`d3ec8f1d73b92f203715c26dbf2e0e64375192d00ddaf26f7fbade7777124de8`; the candidate DEB
SHA-256 was `f5b58ca30f7d69655c36a4933cf1b9b96c76ef1ca8768f443dbc56bd6ae5c438`;
and the installed ASAR SHA-256 was
`869baebb022a7f3c4385874a1ebb32d8b4dd360485485c53da76705d8faa4287`.

Incident `2026-09-16T20-21-46-383Z-ca8bc416-4523-4302-8a65-704f1805d06f` proved a
native-dialog replacement from the genuine supervisor task. The exact invoking CLI exited before
installation, Zenity supplied both restart consent and the native password prompt for
`sudo dpkg -i candidate.deb`, no terminal opened on the healthy path, the renderer became ready,
and the app reopened the same task through its stock `codex://threads/<task-id>` route with Luna
Light preserved. No supervisor, installer, dialog, askpass helper, or rescue-terminal process
remained.

Live renderer evidence also proved the project-local roster, three configured qualification-agent
palette colors, one agent's `#4E9A51` -> `#C05A47` -> `#4E9A51` runtime reload without restart,
model-mismatch lock and immediate restoration, sidebar collapse/expand while project navigation
remained, named delegated attribution, observability target/metrics/CDP access, and the selected
renderer registry. Current live acceptance also proved muted-versus-unmuted completion attention,
exact-ID archive protection, the configured `Control+\`` terminal shortcut from both the chat
composer and focused xterm, and a three-target native wait roster with ordered names, palette
colors, links, explicit unknown-task fallback, and navigation. The outgoing-receipt v5 gate passed
success/failure classification, chronological placement below the stock **Worked for** row,
collapse/expand stability, remount and restart reconstruction, full-text hover, native timestamp,
and native copy. The operator explicitly accepted skipping live switching with a
greater-than-200-turn task; its packed-candidate and deterministic bounded-turn probes remain
green.

A dedicated registered test ship supplied runtime identity without a package-baked client path or
ship name. Removing the sole private observer config hot-unbound the mode-`0600` socket;
restoring it, introducing a second valid config, and removing that ambiguity respectively rebound,
unbound fail-closed, and rebound again through `fs.watch`/Linux inotify without rebuild or restart.
A real loopback transmission rendered a durable outgoing **Accepted by Tinrelay** card and its
routed incoming card with exact runtime route, body, timestamp, and copy actions. Both survived a
task remount. A malformed coordinate exited 2 and produced no accepted card. This qualifies the
TinRelay integration only; it is not a claim that the complete selected visual fleet has passed
live acceptance. Controlled blank, Oops, exhaustion, and rollback fixtures were not repeated
because no changed lifecycle boundary required them. Their earlier results remain carried
capability evidence, not live qualification of this exact candidate.

## 5. Diagnostics, cleanup, and update behavior

For every induced failure, retain the bounded diagnostic JSON, supervisor log, app standard I/O
log, selected desktop log excerpt, and renderer error evidence. The Ubuntu intake established
desktop logs at `~/.local/state/codex/logs` and renderer error state at
`~/.config/Codex/sentry/scope_v3.json`; verify those same owners on every newly qualified
distribution and application build.

After restoration, record:

```sh
dpkg-query --show --showformat='${Package}\t${Version}\t${Architecture}\n' chatgpt
apt-cache policy chatgpt
find "$HOME/.codex/tmtk-rescue" -maxdepth 2 \
  \( -name 'known-good.deb' -o -name 'candidate.deb' -o -name 'known-good.app' \) -print
```

The newest adoption may retain one private candidate/known-good pair for recovery. A later adoption
must remove only older toolkit-owned package or app payloads while preserving incident metadata
and operator-owned `.work` files. Confirm that the vendor APT repository remains configured and
record which available future version would supersede the local `SOURCE+tmtk1` build. Do not run a
system upgrade merely to manufacture that evidence.

Publish only a concise tracked summary tied to a qualification-bearing commit. Keep the raw VM
receipt private and ignored. Name every remaining boundary, including untested desktop/session,
architecture, RPM packaging, and transforms that still fail closed.
