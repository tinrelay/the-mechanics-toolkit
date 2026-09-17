# Task visual palette

- **Current state:** Active
- **Public extraction:** Complete for the standalone transform
- **Fleet qualification:** See the [extraction ledger](../../docs/extraction-ledger.md).

## Why it exists

A long-lived task should be recognizable before its title has been read. This patch gives configured
tasks a restrained color identity across the room canvas, a saturated sidebar identity chip,
selected-row background and outline, and provenanced delegated messages. Inactive rows keep Codex's
stock background; project rows use their existing gutter for the chip, while Recents and View
Activity rows move their contents over to make room. An optional SVG mark can sit behind a room as a
low-opacity watermark. Unconfigured tasks keep stock styling, including the same neutral outline
when selected, so selection never masquerades as identity.

The room treatment follows Codex's active theme. Dark rooms dim the configured color into the
canvas; light rooms fade it into a pale neutral surface, preserving the sense of place without
turning the conversation into a saturated sheet of color.

![Codex Desktop showing task-specific sidebar dots, a matching selected outline, and a room sigil](agent-colors-and-sigils.png)

*The chip carries identity at a glance; the colored room and selected row carry place.*

The same rule may opt an exact task ID out of sidebar archive affordances. That protection is based
on the task ID, never merely a matching title, and it removes archive actions without hiding the
task or changing its state.

## Configuration

Select [agent-roster](../agent-roster/) and place `.codex/agent-roster.json` below any registered
local project root. No project path or identity is compiled into the application. Each `agents`
entry has one current exact `taskId`; `tasks` entries may instead use `taskId`, `titlePattern`, or
both. A visual entry supplies a six-digit hex `color` and may include:

- `protectSidebarArchive`: a boolean requiring an exact `taskId`; and
- `mark`: a safe relative path to an SVG below the project root that owns that roster entry.

Calibration values are bounded percentages. Unknown extension keys are accepted. Invalid owned
values or assets diagnose the feature and leave its last valid runtime projection in place.

Saving a complete valid roster updates the open app without a restart. Aggregate validation runs
before publication; a partial, invalid, or conflicting save leaves the last-good roster in place.

## Owned seam

The transform recognizes four renderer owners: the application/sidebar bootstrap, the task-room
shell, the delegated-message wrapper, and the thread footer fade. It also owns every stock sidebar
archive affordance for the supported build so exact-ID protection cannot disappear from only one
menu or hover action.

Mapped delegated-message color depends on the
[cross-task attribution patch](../cross-task-attribution/)'s provenance surface. Apply attribution
first; palette application refuses when that exact prerequisite is absent.

## Check and apply

`check` and `apply` need no private identity configuration; runtime roster data stays outside the
application package.

```sh
node bin/toolkit.mjs patch task-visual-palette check /path/to/extracted-asar
node bin/toolkit.mjs patch task-visual-palette apply /path/to/disposable-extracted-asar
node test/task-visual-palette.test.mjs /path/to/disposable-extracted-asar /path/to/roster-project
```

The patch command modifies only the supplied extracted tree. The separate staging command can build
and statically verify a new app outside `/Applications`; neither command installs, launches, or
replaces a working application.

## Verification

`test/task-visual-palette-transform.test.mjs` covers the transform's exact generated owners.
`test/task-visual-palette.test.mjs` exercises the current roster consumer, safe
project-owned marks, theme-specific contrast, room/sidebar/delegation behavior, archive
suppression, invalid owned values, and byte-identical second application.

The current transform also keeps the sender name inside an attribution label source-hued while
moving toward the theme's readable endpoint only as far as contrast requires. The surrounding
native label text retains its stock metadata color.

The source-hued-label treatment is covered by the current transform and static behavioral probes.
Current package and live evidence belongs in the fleet
[extraction ledger](../../docs/extraction-ledger.md).

## Non-goals

- inventing task identities or colors;
- recoloring message text or dimming room contents;
- hiding, deleting, pausing, or archiving tasks;
- loading remote marks or files outside the project that owns the roster entry;
- editing the palette from the Codex UI;
- accepting an approximately matching future build.
