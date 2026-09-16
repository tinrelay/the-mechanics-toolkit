# Upgrading The Mechanic's Toolkit

TMTK remains source-only and currently reports package version `0.0.0`. Upgrade
boundaries therefore use exact TMTK revisions and exact Codex Desktop versions and
builds. This file records operator actions when a newer toolkit changes private
configuration, the selected patch fleet, or the installed application. It is not a
release history.

Never install from a moving or dirty toolkit checkout. Preserve local work, use an
immutable published revision, and stage a new candidate from a pristine official
Codex application rather than from an already patched installation.

## After `8a677db` on Codex Desktop build 8881 (unreleased)

This upgrade path starts at TMTK revision
`8a677dba922ab55db2d5e7cb52bcb9f3855d8744` or a later compatible revision already
installed on Codex Desktop `26.908.40834` (build `8881`). It describes the current
unreleased build-8881 work. Do not use it until that work has an exact published
target revision.

The build-8881 fleet grew from 16 to 19 patches. It adds:

- `agent-roster`, the shared runtime source for agent and task identity settings;
- `codex-observability`, the local explicit profiling and DevTools entrance; and
- `renderer-turn-window`, the 200-turn mounted-renderer bound for long-lived tasks.

The existing `tinrelay-pointer-presentation` patch also learns the direct
`tinrelay-message-delivery-v1` shape. Several existing patches now consume the shared
agent roster instead of private feature-specific files.

### Prepare the agent roster

Do this while the known-working application is still running. Leave its existing
runtime files in place until the replacement has passed live checks.

1. Read `workspaceRoot` from the retained `toolkit.local.json`. The old application
   reads these files below that root:

   ```text
   .codex/task-visual-palette.json
   .codex/task-attention-policy.json
   ```

2. Ensure that the intended roster-owning project root is registered as a local
   project in Codex Desktop. The new runtime discovers `.codex/agent-roster.json`
   below registered local project roots; it does not use an embedded workspace path.
3. Create `.codex/agent-roster.json` below that project root and combine the old
   files into it. Start from
   `patches/agent-roster/agent-roster.example.json` and preserve these fields:

   - copy the old palette's top-level `calibration` object to the roster's top level;
   - convert each continuing named agent with an exact `taskId` into an `agents`
     entry with its stable `name` and current `taskId`;
   - convert utility or title-selected rules into `tasks` entries using `taskId`,
     `titlePattern`, or both;
   - carry `color`, `mark`, `protectSidebarArchive`, `keepReasoningOpen`, and
     `modelPin` onto the matching roster entry; and
   - convert every old attention-policy expression into a `tasks` entry with that
     `titlePattern` and `muteCompletion: true`.

   If one task had settings in both old files, combine them in one roster entry.
   `mark` remains relative to the project root that owns the roster. Every exact
   `taskId` may appear in only one roster across all registered local projects.
4. Validate that the new file is owner-controlled and contains no incomplete entry.
   A malformed or conflicting roster does not replace the last valid aggregate, but
   a first invalid roster leaves these features without runtime settings.

Keep the two old files while the old application is live. After the new fleet has
loaded the roster and reproduced the intended behavior, remove or clearly retire the
old files so future edits do not maintain two apparent authorities.

### Update the staging configuration

Make a private replacement for `toolkit.local.json`; do not overwrite the known-good
copy until the new candidate has passed static proof.

Remove `workspaceRoot`. The current parser rejects it as an unknown key because
runtime project discovery now owns that boundary. Preserve the existing
`codexBinary`, `signingIdentity`, and `tinrelay` values when they still name the
intended local artifacts.

For the previous complete 16-patch build-8881 fleet, add these names to
`enabledPatches`:

```json
[
  "agent-roster",
  "codex-observability",
  "renderer-turn-window"
]
```

Keep `runtime-json-reload`, `renderer-patch-registry`, and
`safe-start-readiness`. The catalog applies selected patches in dependency-safe
order, but staging refuses a fleet that selects a roster consumer without
`agent-roster`.

If the retained checkout still names the former GitHub owner, update its remote
without changing its worktree:

```sh
git remote set-url origin https://github.com/tinrelay/the-mechanics-toolkit.git
```

### Stage and adopt the replacement

Check out the exact published target revision without discarding or mixing in local
work. Refresh dependencies and verify the repository:

```sh
npm install
npm run check
npm test
```

Acquire or reuse a pristine official Codex Desktop `26.908.40834` build-`8881`
application. The currently installed patched application is the rollback, not a
staging source. Inspect and stage a separate candidate:

```sh
node bin/toolkit.mjs inspect /path/to/Pristine-ChatGPT.app
node bin/toolkit.mjs stage /path/to/Pristine-ChatGPT.app \
  /path/to/ChatGPT-MechanicsToolkit.app \
  --config toolkit.local.json
```

Adopt only the candidate that passed the complete static fleet. Run the supervisor
from the Codex task that should own recovery:

```sh
bin/tmtk-restart --candidate /path/to/ChatGPT-MechanicsToolkit.app \
  /Applications/ChatGPT.app
```

After the supervisor reports that it is armed, finish the invoking agent turn and
let the person choose **Relaunch Codex**. Do not poll the supervisor. It preserves
the exact working application as rollback and returns to the same task through the
terminal rescue path if the renderer does not become ready.

### Move TinRelay after TMTK

Install and live-check this TMTK fleet before enabling TinRelay's direct dereferenced
delivery. The updated presentation accepts both the old pointer contract and the new
direct-delivery contract, so this order keeps incoming correspondence readable
throughout the cutover.

After TMTK is accepted, follow TinRelay's own `UPGRADING.md` to upgrade its client and
bridge together, move the existing address mapping into the canonical per-ship
address book, prove direct delivery, and then retire the radio-room task. Prefer the
bridge's `--deref` mode when the ship accepts its authority trade-off. TMTK recognizes
the self-addressed delivery sentinel together with the structured TinRelay contract
and presents the validated remote coordinates supplied by TinRelay instead of the
local source-task artifact.

Outgoing TinRelay cards still require the private observer configuration at:

```text
~/.config/tinrelay/SHIP/outgoing-observer.json
```

Its absence does not block incoming pointers or direct deliveries; accepted sends
remain stock command results until the observer is configured.

### Live checks

Before removing the old runtime files or releasing the known-working rollback:

1. Confirm renderer readiness with the retained checkout's
   `bin/did-codex-launch.mjs`.
2. Confirm that the roster reproduces each intended room color, mark, archive
   protection, reasoning-retention choice, model pin, and muted completion rule.
3. Enter and leave Dictate in a model-pinned task and confirm that the temporary
   composer withdrawal does not raise a false `BAD MODEL` warning.
4. Switch into a long-lived task that previously stalled. Confirm that mounted task
   history remains responsive while explicit older-page loading and transcript
   export remain available.
5. Run `bin/tmtk-observe.mjs list`, inspect one renderer's metrics, and make only the
   bounded captures needed to prove the new local observability path.
6. Before the TinRelay client cutover, confirm that an old pointer still renders.
   After the cutover, send one exact-address `--deref` loopback and confirm that its
   body renders directly with the actual TinRelay source and reaches routed state.

The repository move, documentation-link updates, build-8881 presentation corrections,
and model-guard Dictate fix require no stored-state migration. TMTK does not rewrite
Codex task databases during this upgrade.
