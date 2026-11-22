# App-context override

State: active; current compatibility and qualification live in the
[extraction ledger](../../docs/extraction-ledger.md) and [macOS receipt](../../qualification/macos.md).

The native Desktop instruction builder reads an optional `app-context.md` from its configured
Codex home (`~/.codex` by default; `CODEX_HOME` is respected). Its contents replace the entire
interior of the generated `<app-context>` block. The file is literal Markdown, not executable code
or a template. Empty content is respected. Missing content preserves native output byte for byte.
Base/custom instructions outside that block and other instruction sources remain separately owned.

The app refreshes `app-context.default.md` with the default it generated before applying the override.
It writes only changed content and never rewrites `app-context.md`. Default content can depend on
the current chat's enabled features and Git settings; the snapshot is the most recent generation,
not a universal template for every possible chat configuration. It refreshes when the native
builder runs. A refreshed snapshot does not prove that its instructions reached a loaded chat.
No model call is added by the patch itself.

For initial setup, copy the generated default to the override, then edit it. Later compare your
file with the newly generated default using an editor or `diff -u`. After creating, changing or
removing the override, fully quit and relaunch the existing app, then reopen the same chat.
This cold resume is the live-qualified refresh path; no rebuild or new chat is needed. Ordinary
messages and switching away and back are not reliable refreshes: Desktop can reuse an idle loaded
thread and omit freshly built developer instructions. The patch does not invalidate loaded
sessions or replace instructions mid-response. Removing the override restores the generated
default at the next cold resume. If you are withdrawing an earlier
instruction retained in a chat, state that correction explicitly in the override; the patch does
not rewrite previous conversation content. An unreadable override produces an
explicit preparation error; rename it or repair its permissions to restore operation.

On app startup, `app-context.state.json` remembers a fingerprint of the bundled instruction text.
The first run establishes the baseline. Later text changes produce one “App instructions changed”
popup. Acknowledging it records the new fingerprint; failed notification does not acknowledge it.
The popup does not open a diff or change the override. Ordinary minifier renaming and unrelated
bundle changes do not trigger it. The fingerprint covers the owned app-context text templates,
builder text, heartbeat guidance and scheduling-tool terminology. It does not monitor external
skills, project guidance, remote feature settings or model instructions outside that ownership.

The owned seams are the exact native instruction module and its app-ready caller. The transform
rejects unknown or partial owners and reports presence through the existing renderer patch registry.
Focused tests resolve packaged Node externals and execute the actual builder with an isolated
temporary Codex home, covering literal/empty overrides, removal, default snapshots, hosted tool
rewriting, stock fallback, and
notification acknowledgment/retry. Other tests cover fingerprint changes, drift and reapplication.
Staging does not install, launch, edit a live profile, create an override or schedule work.

The first live trial exposed a binding error: the helper used the native crypto variable as fs.
The corrected helper uses the existing filesystem binding. The regression probe resolves both
bindings from the packaged bootstrap instead of injecting fs under an assumed variable name.
