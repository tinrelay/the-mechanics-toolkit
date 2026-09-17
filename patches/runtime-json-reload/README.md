# Runtime JSON reload

- **Current state:** Active
- **Public extraction:** Complete for the standalone transform
- **Fleet qualification:** See the [extraction ledger](../../docs/extraction-ledger.md).

## Why it exists

Operator-owned JSON policy should not require an application restart. This patch watches the
`.codex` directories below Codex Desktop's currently registered local project roots and announces
changes to `agent-roster.json`.

Each consuming patch supplies its own acceptance callback. The callback re-reads through Codex's
existing local App Server filesystem boundary and applies the replacement only after its complete
schema and filesystem-safety checks pass. Invalid, partial, missing, oversized, or unsafe saves
leave the last-good runtime value in place.

The watcher is deliberately ignorant of the schema. The agent-roster patch owns aggregate
validation; feature patches consume only their own optional fields.

## Owned seam

The Electron main process owns one non-persistent `fs.watch` per renderer web contents. Watching the
directory rather than either file preserves ordinary atomic-save behavior. Relevant events are
debounced and delivered over the existing Electron renderer message bus; unknown filenames never
cross the bridge. The watcher closes with its web contents.

The renderer owns a one-name acceptance registry. It serializes the consumer callback, coalesces a
change that arrives during validation into one later retry, and performs an initial callback when a
consumer registers so no save can be lost during startup.

## Configuration and application

No workspace path is compiled into the application. Project registration changes update the
watched roots at runtime.

```sh
node bin/toolkit.mjs patch runtime-json-reload check /path/to/extracted-asar
node bin/toolkit.mjs patch runtime-json-reload apply /path/to/disposable-extracted-asar
node test/runtime-json-reload.test.mjs /path/to/disposable-extracted-asar
```

The synthetic transform and behavioral probes cover directory-watch filtering, atomic-save-style
rename events, debounce, serialized callbacks, startup acceptance, renderer cleanup, and
byte-identical second application. The palette and attention probes separately prove that malformed
saves retain the last-good value and complete valid saves are adopted.

## Non-goals

- accepting or interpreting the roster schema;
- watching arbitrary paths or filenames;
- hot-reloading staging configuration or compiled Tinrelay identity;
- editing policy through the Codex UI; or
- replacing the ordinary post-update port and staged-app verification pass.
