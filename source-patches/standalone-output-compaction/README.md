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

[`codex-0.155.0-alpha.9.2.patch`](codex-0.155.0-alpha.9.2.patch) has exact catalog entries for
three source trees. The accepted macOS Desktop `26.917.71314` / build `10954` bundles
`codex-cli 0.155.0-alpha.16.4` at upstream commit
`3853cf0c49daadcacaacceb2cbb732f512eaacdb`; the three repaired source files have the same
before and after hashes as build `10789`. The previous macOS Desktop `26.917.62051` / build `10789`
bundles `codex-cli 0.155.0-alpha.16.3`; its qualified upstream commit is
`ffa06df2317e3e65fc74da977a5884710c5382d5`. The earlier Desktop build `9922` used tag
`rust-v0.155.0-alpha.9.2` at commit `4607249e430dac1c961df4dc615beae88e33cec8`.
The source-patch command verifies each selected commit and every target file's exact qualified
before or after hash; the shared textual diff alone is not an applicability claim.

For a stable-Rust build of the `10954` source, also apply the separate
[ChatGPT query-depth source patch](../chatgpt-query-depth/). It addresses a crate-level compiler
limit observed on another ARM64 macOS host without changing this repair's three source files.

```sh
node bin/toolkit.mjs source-patch standalone-output-compaction-10954 check /path/to/codex
node bin/toolkit.mjs source-patch standalone-output-compaction-10954 apply /path/to/codex
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
