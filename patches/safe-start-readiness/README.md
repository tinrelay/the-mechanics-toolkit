# Safe-start readiness

This patch gives the toolkit's restart supervisor one narrow fact: the primary Codex application
routes reached their committed renderer mount. It reuses Codex's stock trusted-renderer `ready`
event and makes the main process call Codex's existing per-launch marker writer only when that
event comes from the primary window. Hidden secondary renderers can also mount `AppRoutes`; their
`ready` events must not accept a launch whose primary window reached an error boundary.
Readiness does not prove that every later task turn renders; those generated owners need their own
post-repack probes.

The marker path comes from the launch-only `CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH` environment
variable. The toolkit creates a fresh private path for every attempt, so an old marker cannot make
a later launch look healthy. The patch does not restart Codex, choose a rescue agent, open a
terminal, or kill a wedged process; those decisions belong to `tmtk-restart`.

Every staged fleet must include this infrastructure patch. Without it, a healthy candidate cannot
produce the supervisor's acceptance signal and would be misclassified as an unready launch.

The transform is qualified through the current platform fleets recorded in the
[extraction ledger](../../docs/extraction-ledger.md). It fails closed when the app-shell owner,
trusted IPC boundary, or stock marker writer changes. All qualified fleets produced the private
marker through supervised installation and reached healthy renderer readiness. The Linux
run also froze a genuine task and exact bundled-CLI ancestor before replacement; controlled
failure, terminal rescue, and known-good restoration remain separate open gates there. Windows
carried the marker through exact MSIX activation and used it to accept the final known-working
restoration after a deliberately broken candidate exhausted three repair turns.
