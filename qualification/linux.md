# Linux desktop qualification

This runbook qualifies one exact Linux Codex Desktop package, distribution, desktop session,
architecture, and TMTK patch fleet. Ubuntu DEB and Fedora RPM are separate package and lifecycle
boundaries. Their authenticated vendor channels currently expose different Desktop builds, so both
exact generated-owner profiles are current.

The Ubuntu target is Codex Desktop `26.915.31029` / build `9771`; the Fedora target remains Codex
Desktop `26.911.61220` / build `9647`. Both use the same 16 patch implementations. Qualification is
on Ubuntu 24.04.5 LTS ARM64 and Fedora Workstation 44 ARM64 under GNOME Wayland. The DEB adapter
supports `arm64` and `amd64`; the RPM adapter supports `aarch64` and `x86_64`. CPU architecture
controls package identity, native payloads, executables, and live qualification, but does not earn
an architecture-specific JavaScript profile.

Ubuntu build `9771` evidence:

- authenticated pristine DEB SHA-256
  `5c01ce35eccea9e95d16de052c74f16deed381408931e82b106d7dbeeed8de4a`;
- accepted `26.915.31029+tmtk1` candidate SHA-256
  `230aa34c712c83a2f8d95bdcc351e75ba18e49ac550519bdc60d3bedb6871828`;
- installed patched ASAR SHA-256
  `77fcf390fc27700b65b271b435250f7a213de8f1e0459ec917791c24d64e9f31`;
- package executable SHA-256
  `15f4066aff635c8e4ffc39b3653cb8aa8b91481d731e88c8e5a7aaca5c133f41`; and
- bundled CLI SHA-256
  `74a97f16b1683f0f8da6c06960b8b7246129397afa0605c74b8d186650507b06`.

The DEB passed authenticated-source inspection, reconstruction, all 16 transforms, post-pack
probes, native-payload preservation, and byte-identical second application. The exact candidate was
installed. The main log reached `ready-to-show`, main-frame load, App Server initialization, and
React-root rendering; AT-SPI exposed application `Codex` and frame `ChatGPT`. This current-build
pass deliberately stopped there: it did not rerun the supervisor or the complete live feature
runbook after the shared transforms and Linux lifecycle were already qualified.

Fedora build `9647` evidence:

- authenticated pristine RPM SHA-256
  `70d7ac841fa04b7867c84d17b7410fb6a8f9c774c160ae029959efb2f120dfdf`;
- accepted `26.911.61220-1.tmtk1` candidate SHA-256
  `96d21a0931dfb02944b223a761aa1bd45a844cbe154ae8021434944944c61d98`;
- installed patched ASAR SHA-256
  `606d9767a92b2f51749c648a21b5485f1673babc152648be6bcd6e0f576778cb`; and
- genuine supervisor incident
  `2026-09-17T21-59-41-356Z-76df7a6c-9ff1-45dd-a68b-6da8706b8608`.

The RPM passed authenticated-source inspection, reconstruction, all 16 transforms, post-pack
probes, native-payload preservation, byte-identical second application, supervised installation,
and renderer readiness. The existing build-9647 Linux live feature pass covered registry and
observability, roster/palette/policy reload, model and archive protection, sidebar collapse,
terminal open and close, task attribution, wait roster, outgoing receipts, and TinRelay
presentation across remount. It remains evidence for Fedora's current build-9647 generated owners;
it is not presented as current Ubuntu package evidence. The greater-than-200-turn live fixture and
destructive blank/Oops/exhaustion recovery fixtures were not rerun; their deterministic probes
remain current.

Run from the Linux toolkit checkout. Start from an ignored private copy of
[`examples/toolkit.linux.example.json`](../examples/toolkit.linux.example.json), replacing its
operator-specific values. Keep one pristine vendor package and one current candidate. Record exact
commands and compact results under an ignored `.work/qualifications/` directory; do not retain
failed packages or extracted package trees as evidence.

## 1. Freeze the environment and package identity

For either distribution, record:

```sh
cat /etc/os-release
uname -m
printf 'desktop=%s\nsession=%s\nsession_type=%s\n' \
  "$XDG_CURRENT_DESKTOP" "$DESKTOP_SESSION" "$XDG_SESSION_TYPE"
node bin/toolkit.mjs inspect /usr/lib/chatgpt
sha256sum "$SOURCE_PACKAGE"
```

For Ubuntu DEB also record:

```sh
dpkg-deb --field "$SOURCE_PACKAGE" Package Version Architecture Maintainer Installed-Size
ar t "$SOURCE_PACKAGE"
gpg --show-keys --with-colons /usr/share/keyrings/chatgpt-archive-keyring.gpg
dpkg-query --show --showformat='${Package}\t${Version}\t${Architecture}\n' chatgpt
```

For Fedora RPM also record:

```sh
rpm --query --package --queryformat '%{NAME}\t%{VERSION}\t%{RELEASE}\t%{ARCH}\n' \
  "$SOURCE_PACKAGE"
rpmkeys --checksig --verbose "$SOURCE_PACKAGE"
gpg --show-keys --with-colons \
  /etc/pki/rpm-gpg/RPM-GPG-KEY-chatgpt-3BFA0E4AE8B8CC16A2D9BA684A3B4A566C4660E4.asc
rpm --query chatgpt
```

The package must be `chatgpt`, its architecture must match the machine, and its inner Desktop
version/build must match the selected profile. DEB staging verifies `_gpgorigin` against the
installed ChatGPT APT keyring. RPM staging verifies the package signature fingerprint against the
installed ChatGPT RPM key. Presence of a signature field without the trusted-key comparison is not
authentication. Record whether the live desktop is X11 or Wayland; a pass in one is not proof of
the other.

## 2. Prove the candidate statically

Install repository dependencies without modifying the vendor package, then run the complete source
suite and the format-specific stage:

```sh
npm install
npm run check
npm test

# Ubuntu
node bin/toolkit.mjs stage-deb "$SOURCE_PACKAGE" "$CANDIDATE_PACKAGE" --config "$CONFIG"

# Fedora
node bin/toolkit.mjs stage-rpm "$SOURCE_PACKAGE" "$CANDIDATE_PACKAGE" --config "$CONFIG"
```

The result must be `staged-deb-static-proof-green` or `staged-rpm-static-proof-green`. It must say
the pristine source was untouched, the second patch application was byte-identical, post-pack
probes passed, native payload was preserved, and nothing was installed or launched. Record the
outer candidate identity, inner application version/build, ASAR hash, executable and CLI hashes,
selected patches, and changed generated files.

The rebuilt package is explicitly a local TMTK artifact. It must not claim the vendor signature:
the DEB omits `_gpgorigin`, and the RPM has no package signature. Read-only checks for every selected
transform stay with the compact receipt. A transform that does not recognize the exact generated
owner remains unsupported; do not widen its matcher merely to make an inventory green.

## 3. Healthy supervised adoption

Begin from the Desktop task being preserved. Verify that the current installed app is healthy,
that the known-good package reproduces its exact installed identity, and that the candidate receipt
names the pristine source. The initiating task must have enough local authority to create private
supervisor state, survive the Desktop exit, and invoke the native askpass path; never broaden its
access silently.

```sh
bin/tmtk-restart --candidate "$CANDIDATE_PACKAGE" \
  --candidate-source "$SOURCE_PACKAGE" \
  --known-good "$KNOWN_GOOD_PACKAGE" /usr/lib/chatgpt
```

After the command says the supervisor is armed, finish the invoking turn and use the native
**Relaunch Codex** dialog. Ubuntu installs through exact `sudo -A dpkg --install`; Fedora installs
through exact `sudo -A rpm --upgrade --replacepkgs --oldpackage`. Record the dialog backend
(`kdialog`, `zenity`, or `yad`) and its
affirmative and cancellation labels.

The receipt must prove:

1. the exact invoking bundled CLI ancestor exited before Desktop replacement;
2. the exact `/usr/lib/chatgpt/ChatGPT` process exited without a name-based process kill;
3. the state databases accepted a writer before package installation;
4. package installation used the selected native askpass path or an already-root supervisor;
5. the distribution package database reports the local candidate and exact architecture;
6. the installed inner version/build and payload hashes match the candidate;
7. the directly launched Desktop process reached the one-use renderer readiness marker; and
8. the same task returned without supervisor, installer, dialog, askpass, or rescue-terminal
   residue.

Record `/proc/PID/exe` for the launched main process. Static proof does not substitute for this
runtime boundary.

## 4. Exercise current behavior

For each distribution, exercise every generated owner or platform mechanism changed by the port.
The ordinary current gate includes:

- registry and observability discovery;
- project roster, palette, policy, and runtime reload;
- model mismatch lock and restoration;
- exact-ID archive protection and sidebar behavior;
- terminal open and close from both composer and focused terminal;
- cross-task attribution, outgoing receipt success/failure, and wait roster;
- TinRelay accepted outgoing and routed incoming presentation across remount; and
- the separately built Codex executable when standalone-output compaction is selected.

Carry an earlier live result only when the current owner and behavior are unchanged and the complete
current fleet passes static proof plus a healthy launch. Record deliberate omissions explicitly.
The greater-than-200-turn live fixture remains intentionally waived when its deterministic packed
probe is current; it must not be reported as a live pass.

Supervisor failure fixtures are a separate destructive qualification. Re-run blank-renderer,
living-Oops, exhaustion, rescue-terminal, and known-good restoration only when that lifecycle
boundary changes or the operator explicitly requests the exercise. Every fixture must be a complete
package with a valid receipt, never an in-place edit under `/usr/lib/chatgpt`.

## 5. Close the workbench

Keep the raw VM receipt private and ignored. Publish only the compact qualification summary tied to
the accepted source revision. Preserve the pristine package and current candidate while the port is
active. After acceptance, remove transaction-only rollback copies, failed packages, superseded
candidates, extracted ASAR/package trees, and temporary source transfers. Retain hashes, receipts,
logs, and source identity rather than multi-gigabyte package history.

Confirm the vendor repository remains configured so a later official version can supersede the
local `+tmtk1` DEB or `.tmtk1` RPM. Do not run a system upgrade merely to manufacture that evidence.
The tracked record must name the distribution, package format, architecture, desktop/session,
exact package and ASAR identities, live gates actually exercised, and anything deliberately unrun.
