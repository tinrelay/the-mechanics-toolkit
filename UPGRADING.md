# Upgrading The Mechanic's Toolkit

TMTK is source-only and currently reports package version `0.2.0`. Exact TMTK revisions and exact
Codex Desktop versions and builds still define compatibility. This file tells an operator what must
change when adopting the current toolkit; Git history preserves the upgrade instructions for older
ports.

Never install from a moving or dirty toolkit checkout. Preserve local work, use an immutable
published revision, and stage from a pristine official Codex package rather than an already patched
installation. The [current build matrix](docs/extraction-ledger.md#current-build-matrix) is the
authority for supported packages and selected fleets.

## 0.2.0

This upgrade applies to TMTK `0.1.x` installations. TMTK `0.2.0` is the first coherent current
cross-platform release for Codex Desktop `26.911.61220` / build `9647`:

- macOS ARM64 uses the 19-patch fleet;
- Windows 11 ARM64 uses the 16-patch fleet;
- Ubuntu uses the 16-patch DEB fleet on `arm64` and `amd64`; and
- Fedora uses the same 16-patch ASAR fleet in an RPM on `aarch64` and `x86_64`.

The qualified Ubuntu and Fedora vendor packages contain the same ASAR. Their package
authentication, reconstruction, installation, restart, and recovery boundaries remain
independently qualified. The current live VMs are ARM64; the package adapters deliberately accept
the corresponding AMD64 architecture names without adding an architecture-specific JavaScript
profile.

1. Check out an exact published `0.2.0` revision, install its Node dependencies, and run
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
4. Acquire the pristine official build-`9647` package for the target platform. Stage the selected
   fleet with `stage-macos`, `stage-deb`, `stage-rpm`, or `stage-msix`. The former macOS-only
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
