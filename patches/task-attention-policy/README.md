# Task attention policy

- **Current state:** Active
- **Public extraction:** Complete for the standalone transform
- **Patch-specific evidence:** Build `8109` static stage and live use green, 2026-09-07

## Why it exists

Some persistent utility tasks do useful work without needing to light the entire bridge every time
they finish. Their output should remain available and their failures should remain visible, but a
routine completion does not always deserve a sidebar unread marker, Dock badge, or native
notification.

The most useful everyday case is straightforward: mute completion notifications from a selected
task while leaving that task and its results available.

This patch lets an operator identify those tasks with anchored regular expressions. A match mutes
only completion attention; it does not hide, archive, pause, cancel, mark read, or alter the task.
Running state, output, errors, approvals, input requests, and ordinary destination-task alerts stay
visible.

## Configuration

Select [agent-roster](../agent-roster/) and set `muteCompletion` on any `agents` or `tasks` entry.
Task rules may select by exact `taskId`, `titlePattern`, or both. Every matching rule is considered,
so an additive title rule can temporarily mute a named agent without replacing its exact identity:

```json
{"tasks":{"mute-tamsin-for-the-day":{"titlePattern":"^Tamsin","muteCompletion":true}}}
```

Unknown fields remain available to other patches and plugins. Invalid owned values are diagnosed
and do not mute completion.

Complete valid external saves take effect without restarting Codex. Malformed, partial, oversized,
unsafe, or duplicate-identity replacements preserve the last-good aggregate.

## Owned seam

The transform joins four stock ownership surfaces:

1. the task-row projections for unread, approval, waiting, and hover-card attention;
2. the global unread selector that feeds the Dock and collapsed-sidebar counts;
3. the native turn-complete notification owner; and
4. the app bootstrap and state atom that load and publish the policy.

It resolves title and ID from Codex's actual task metadata. Missing, duplicated, partial, or changed
owners stop the transform with `Upstream changed`; it does not infer provenance from visible text.

## Check and apply

`check` and `apply` need no private policy configuration; runtime roster data stays outside the
application package.

```sh
node bin/toolkit.mjs patch task-attention-policy check /path/to/extracted-asar
node bin/toolkit.mjs patch task-attention-policy apply /path/to/disposable-extracted-asar
node test/task-attention-policy.test.mjs /path/to/disposable-extracted-asar /path/to/roster-project
```

The patch command modifies only the supplied extracted tree. The separate staging command can build
and statically verify a new app outside `/Applications`; neither command installs, launches, or
replaces a working application.

## Verification

`test/task-attention-policy-transform.test.mjs` covers the historical standalone profile.
`test/task-attention-policy.test.mjs` exercises the current build-`8881` roster consumer, exact-ID
and title-pattern matching, invalid owned values, all four attention surfaces, and byte-identical
second application.

The operational build-`7942` patch was accepted in live use before extraction: ignored utility-task
completion did not create task attention, a native notification, or a Dock badge, while an ordinary
task still did. Build `8881` live acceptance covered the current mute behavior.

## Non-goals

- muting approvals, questions, errors, or active work;
- matching message bodies or sender labels;
- editing policy from the Codex UI;
- patching an application bundle in place;
- accepting an approximately matching future build.
