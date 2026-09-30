# Standalone-output compaction

Preserves a current agent-to-agent or other standalone external input when it is the turn that
crosses a context-compaction boundary. Without this repair, compaction can discard that input and
leave the resumed agent acting coherently on an obsolete checkpoint—the observed "time travel"
failure.

## What the person sees

The agent receives a new request and may even perform part of it correctly. If the turn compacts,
the agent can then wake up at an older, already-finished request and treat that as the current job.
From the chat surface, it looks like the agent abruptly traveled backward: it repeats old work,
answers a question nobody just asked, contradicts files or tool results it produced moments ago,
or sends a confident report about the wrong task. Repeating an older state-changing instruction can
also be materially unsafe.

This repair keeps the actual incoming instruction in the compacted history with its external
provenance intact. That matters because the agent should finish the request that was truly delivered,
not infer its job from whichever older user-shaped message happened to remain visible.

## Known upstream reports

- [`openai/codex#42695`](https://github.com/openai/codex/issues/42695) documents the directly
  repaired path: a `send_message_to_thread` instruction begins executing, compaction drops that
  current instruction, and the agent resumes an obsolete completed task and produces an incorrect
  execution report.
- [`openai/codex#42611`](https://github.com/openai/codex/issues/42611) documents a related but
  broader symptom in an ordinary CLI turn: an already-answered user message is treated as newly
  submitted after compaction. This patch does not claim to fix that separate input shape.
- [`openai/codex#42460`](https://github.com/openai/codex/issues/42460) documents an earlier
  cross-thread failure in which a delegation card appears but the prompt body never enters the
  receiving model's context. That is a pre-execution delivery failure, not the mid-turn compaction
  loss fixed here.

The three reports can look similar to a person because each may surface as irrelevant or repeated
work. Their event shapes differ, so the toolkit keeps the patch claim narrow.

The defect is in the open-source Codex App Server/Core, not the desktop renderer. App-server inputs
such as `send_message_to_thread` are recorded as standalone `FunctionCallOutput` items with no
`call_id`, specifically so they keep external provenance rather than impersonating a user message.
The affected compaction paths did not retain that newer input shape. This patch retains only those
unpaired external items, caps each at 10,000 estimated tokens, and leaves ordinary paired tool
results discardable.

## Qualified source

[The current source diff](codex-0.159.0.patch) is qualified for the staged macOS Desktop
`26.928.20755` / build `12246`, which bundles `codex-cli 0.159.0` at upstream commit
`687a119f0fcaace47e1f1abcc77cec6c813fd6da`. Its focused compaction tests passed red on
pristine source and green after the patch; the stable-Rust release build succeeded. The catalog
also retains exact entries for earlier supported builds. The source-patch command verifies the
selected commit and every target file's exact before or after hash; the shared textual diff alone
is not an applicability claim.

Build `12246` did not need the separate
[ChatGPT query-depth source patch](../chatgpt-query-depth/); that exact patch remains for the
earlier build-`11645` source whose crate exceeded a compiler limit on another ARM64 macOS host.

```sh
node bin/toolkit.mjs source-patch standalone-output-compaction-12246 check /path/to/codex
node bin/toolkit.mjs source-patch standalone-output-compaction-12246 apply /path/to/codex
```

For another Codex revision, port the behavior and tests deliberately. Do not widen or force the
old diff.

## Build and verify

Run the focused tests from the patched Codex checkout, then build from the TMTK checkout:

```sh
cd /path/to/codex/codex-rs
just test -p codex-core compact_remote_v2::tests::build_v2_compacted_history_filters_to_installed_retention_shape
just test -p codex-core compact::tests::insert_initial_context_before_standalone_function_output
cd /path/to/the-mechanics-toolkit
bin/tmtk-build-codex /path/to/codex
```

The TMTK wrapper builds the ordinary release binary with
`CARGO_PROFILE_RELEASE_LTO=off` by default. Codex enables ThinLTO in its release profile, but the
frontier build is qualification input rather than a performance release and does not justify the
extra link time. Set `CARGO_PROFILE_RELEASE_LTO=thin` explicitly when production-identical LTO is
required; the wrapper preserves an explicit caller value.

The complete `codex-core` package gate remains worthwhile in a fully provisioned build environment.
It requires helper binaries and sandbox facilities beyond the focused tests.

## Desktop integration

Building produces `codex-rs/target/release/codex`. Set `codexBinary` in the private toolkit config
to that absolute path, enable the desktop package patch named `standalone-output-compaction`, and
run the normal staged-app flow. The package transform verifies that the built binary reports the
same CLI version as the vendor bundle before copying it into the candidate.

Source application, compilation, desktop staging, application replacement, and live acceptance
are separate authority and verification seams. The toolkit distributes neither upstream source
nor a compiled Codex binary. Rollback restores the untouched vendor app; no rollout rewrite is
required because this repair changes future compaction boundaries.
