# Agent roster

This infrastructure patch discovers one `.codex/agent-roster.json` across the local project roots
registered in Codex Desktop. It publishes an in-memory roster service for feature patches; it does
not color, mute, pin, protect, or otherwise change any task by itself.

The roster's `agents` entries require a stable `name` and singular current `taskId`. `tasks` entries
identify non-agent utility tasks with `taskId`, `titlePattern`, or both. Every other key is deliberately
extension-friendly: each selected patch validates and consumes only the fields it owns, and ignores
fields belonging to other patches or plugins.

Any number of registered projects may own rosters. Their entries are aggregated; the same exact
`taskId` appearing in two rosters is a hard conflict. Malformed identity/selectors, duplicate task
identity, or an unreadable file emit a renderer diagnostic and do not replace the last valid aggregate.
Removing all rosters disables their effects. Relative assets resolve safely below the project that
owns the individual entry.

Current qualified profiles are Desktop 26.908.40834 / build 8881 on macOS and Linux. Windows uses the
same contract once its generated-code profile is qualified.
