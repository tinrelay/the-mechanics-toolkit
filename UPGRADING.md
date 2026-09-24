# Upgrading The Mechanic's Toolkit

TMTK is source-only and currently reports package version `0.2.2`. Exact TMTK revisions and exact
Codex Desktop versions and builds still define compatibility. This file tells an operator what must
change when adopting the current toolkit; Git history preserves the upgrade instructions for older
ports.

Never install from a moving or dirty toolkit checkout. Preserve local work, use an immutable
published revision, and stage from a pristine official Codex package rather than an already patched
installation. The [current build matrix](docs/extraction-ledger.md#current-build-matrix) is the
authority for supported packages and selected fleets.

## 0.2.2

This update advances macOS ARM64 to Codex Desktop `26.917.62051` / build `10789`. The current
18-patch fleet includes a same-version `codex-cli 0.155.0-alpha.16.3` build with the standalone
external-output compaction repair. The vendor now owns turn pagination, so this fleet does not
select TMTK's renderer-turn-window patch. Windows build `9922`, Ubuntu build `9771`, and Fedora
build `9647` remain separate current platform targets; do not apply the macOS generated-owner
profile to their packages.

Use the official pristine macOS application, the exact `0.2.2` toolkit source and its private
configuration, and the separately verified same-version Codex binary to stage one candidate.
Adopt it through `tmtk-restart` only with operator confirmation. Static staging does not prove
that a task renders: the first build-`10789` candidate emitted renderer readiness while showing
Codex's Oops screen. The corrected candidate subsequently opened real tasks and passed the
focused live checks. The supervisor's early-readiness gap remains an explicit limitation; do not
interpret its `ready` receipt alone as a usable-task guarantee.

No task database migration is required. After acceptance, remove superseded loose applications,
extracted trees, and transient rollback payloads; keep at most one pristine vendor artifact and
one current candidate.

## 0.2.1

This upgrade applies to TMTK `0.1.x` and `0.2.0` installations. TMTK `0.2.1` advances macOS while
retaining the already qualified Windows and Linux ports:

- macOS ARM64 uses the 19-patch fleet on Codex Desktop `26.915.31945` / build `9922`;
- Windows 11 ARM64 uses the 16-patch fleet on `26.915.31945` / build `9922`;
- Ubuntu uses the 16-patch DEB fleet on Desktop `26.915.31029` / build `9771`, for `arm64` and
  `amd64`; and
- Fedora uses the 16-patch RPM fleet on Desktop `26.911.61220` / build `9647`, for `aarch64` and
  `x86_64`.

The Linux vendor channels currently expose different Desktop builds, so both exact generated-owner
profiles are current. They share the patch implementations, not the vendor ASAR bytes. Package
authentication, reconstruction, installation, and lifecycle evidence remain platform-specific.
The current live VMs are ARM64; the package adapters deliberately accept the corresponding AMD64
architecture names without adding architecture-specific JavaScript profiles.

1. Check out an exact published `0.2.1` revision, install its Node dependencies, and run
   `npm run check` and `npm test`.
2. Replace the old private example with the platform-specific template under [`examples/`](examples/):
   `toolkit.macos.example.json`, `toolkit.linux.example.json`, or
   `toolkit.windows.example.json`. Preserve only the local paths and policy that still apply.
   `toolkit.example.json` no longer names macOS implicitly.
3. Remove `tinrelay.localShip` from private configuration. Preserve `tinrelay.client` only when
   legacy pointer inspection needs the local TinRelay executable. If outgoing TinRelay cards are
   enabled, keep exactly one valid observer configuration at:

   ```text
   ~/.config/tinrelay/${SHIP}/outgoing-observer.json
   ```

   TMTK discovers the active ship from that file. Zero or multiple valid observer configurations
   disable outgoing presentation only; they do not block incoming messages.
4. Acquire the pristine official package named by the current build matrix for the target platform.
   Stage the selected fleet with `stage-macos`, `stage-deb`, `stage-rpm`, or `stage-msix`. The former macOS-only
   `stage` command is now named `stage-macos`. Do not use a patched installed application as the
   candidate source.
5. Adopt the candidate through `tmtk-restart`. Confirm renderer readiness, roster and policy
   behavior, one ordinary task message, and one TinRelay loopback before accepting it.
6. Close the workbench when the candidate is accepted. Keep compact receipts, hashes, and source
   identity. Delete the transient rollback, extracted package trees, failed outputs, and superseded
   candidates. A platform campaign retains at most one pristine package and one current candidate,
   not a speculative package history.

The macOS-specific operational guides are now named
[`docs/macos-update-workflow.md`](docs/macos-update-workflow.md) and
[`docs/macos-local-signing.md`](docs/macos-local-signing.md). Platform-neutral staging and restart
contracts remain in [`docs/staging.md`](docs/staging.md) and [`docs/safe-start.md`](docs/safe-start.md).

Upgrade TMTK before enabling a TinRelay bridge that emits the current full-delivery envelope. New
TMTK accepts both the legacy and current delivery forms; old strict presentation code may reject a
new envelope.

No Codex task database migration is required.
