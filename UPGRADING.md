# Upgrading The Mechanic's Toolkit

TMTK is source-only and currently reports package version `0.1.1`. Exact TMTK revisions and exact
Codex Desktop versions and builds still define compatibility. This file records actions an operator
may need after updating TMTK; it is not a release history.

Never install from a moving or dirty toolkit checkout. Preserve local work, use an immutable
published revision, and stage from a pristine official Codex package rather than an already patched
installation. [`docs/update-workflow.md`](docs/update-workflow.md) owns the complete staging and
adoption procedure.

## 0.1.1

This upgrade applies to a `0.1.0` installation on Codex Desktop build `8881`. TMTK `0.1.1` moved the
qualified fleet to Desktop `26.908.70816` / build `9275` and changed how TinRelay ship identity is
provided at runtime.

1. Check out an exact published `0.1.1` revision that supports the target operating system and
   build. Refresh dependencies and run the repository checks.
2. Remove `tinrelay.localShip` from `toolkit.local.json`. Preserve `tinrelay.client` when legacy
   pointer inspection still needs the local TinRelay executable.
3. If outgoing TinRelay cards are enabled, keep exactly one valid observer configuration at:

   ```text
   ~/.config/tinrelay/SHIP/outgoing-observer.json
   ```

   TMTK discovers the active ship from that file. Adding, removing, or renaming the observer
   configuration takes effect without rebuilding TMTK or restarting Codex. Zero or multiple valid
   observer configurations disable outgoing presentation only; they do not block incoming
   messages.
4. Acquire the pristine official build `9275` package for the target platform, stage the selected
   fleet, and adopt it through `tmtk-restart`. Do not use the installed patched application as the
   staging source.
5. Confirm renderer readiness, runtime roster behavior, and one incoming and outgoing TinRelay
   message before releasing the known-working rollback.

Upgrade TMTK before enabling a TinRelay client that sends full delivery envelopes. Current
TinRelay sends message bodies by default; use `--pointer` only when a deployment has a concrete
reason to preserve the older indirection. Once direct delivery works, the radio-room task is no
longer required.

No Codex task database migration is required.

## 0.1.0

This upgrade applies to unversioned TMTK revisions at or after
`8a677dba922ab55db2d5e7cb52bcb9f3855d8744` on Codex Desktop build `8881`.

### Create the agent roster

Do this while the known-working application is still available. The old application reads these
files below the `workspaceRoot` retained in `toolkit.local.json`:

```text
.codex/task-visual-palette.json
.codex/task-attention-policy.json
```

Create `.codex/agent-roster.json` in the intended registered Codex project. Start from
`patches/agent-roster/agent-roster.example.json` and move the old settings into it:

- copy the palette's top-level `calibration` object;
- create one `agents` entry for each continuing named agent with its stable `name` and current
  `taskId`;
- create `tasks` entries for utility or title-selected rules, using `taskId`, `titlePattern`, or
  both;
- carry `color`, `mark`, `protectSidebarArchive`, `keepReasoningOpen`, and `modelPin` onto the
  matching entry; and
- convert each old attention-policy expression into a task entry with that `titlePattern` and
  `muteCompletion: true`.

Combine settings for the same task in one entry. Every exact `taskId` may appear in only one roster
across all registered projects. Keep the two old files until the new fleet has reproduced the
intended behavior, then remove or clearly retire them so they do not look authoritative.

### Update the private staging configuration

Make a private replacement for `toolkit.local.json`; keep the known-good copy until the candidate
passes static proof.

- Remove `workspaceRoot`; registered-project discovery now owns roster location.
- Preserve `codexBinary`, `signingIdentity`, and `tinrelay` values that still name the intended
  local artifacts.
- Add `agent-roster`, `codex-observability`, and `renderer-turn-window` to the previous complete
  16-patch build-8881 fleet.
- Keep `runtime-json-reload`, `renderer-patch-registry`, and `safe-start-readiness` enabled.

If the retained checkout still names the former GitHub owner, update its remote without changing
the worktree:

```sh
git remote set-url origin https://github.com/tinrelay/the-mechanics-toolkit.git
```

Stage and adopt the replacement through [`docs/update-workflow.md`](docs/update-workflow.md). After
launch, confirm that the roster reproduces the intended colors, marks, archive protection,
reasoning retention, model pins, and muted completion rules before removing the old runtime files.

No Codex task database migration is required.
