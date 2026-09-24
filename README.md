# The Mechanic's Toolkit (TMTK)

<p align="center">
  <img src="assets/the-mechanics-toolkit-icon.svg" width="168" alt="The Mechanic's Toolkit: a precision extraction rig opening a lit path through a dark machine room">
</p>

**TMTK is an unofficial, Codex Agent-authored patch kit for exact builds of Codex Desktop and the
open-source Codex App Server/Core executable it bundles.**

It recognizes known package structures, applies narrowly owned repairs, and fails closed when an
upstream build changes. It does not distribute Codex applications, extracted vendor source,
compiled binaries, credentials, or personal configuration.

Give the repository to the Codex agent doing the work. The agent should identify the exact offered
Desktop version and build, select only an exact qualified profile, stage one complete candidate,
and explain the interruption and rollback before replacing the installed application.

## Current compatibility

Compatibility belongs to an exact Desktop build and platform package, not a nearby version number.
The detailed evidence and residual boundaries live in the platform runbooks and
[extraction ledger](docs/extraction-ledger.md).

| Platform package | Current Desktop target | Qualification boundary |
| --- | --- | --- |
| macOS ARM64 application | `26.917.71314`, build `10954` | Complete 18-patch fleet; static proof, supervised adoption, usable task, and focused live behavior. |
| Windows MSIX | `26.917.71314`, build `10954` | x64 and ARM64 tooling; ARM64 signed-package stage and genuine task-led supervised replacement opened a usable task. |
| Ubuntu DEB | `26.917.71314`, build `10954` | `arm64` and `amd64` package support; ARM64 authenticated stage and direct install opened a usable task. Supervisor adoption on this build was not exercised. |
| Fedora RPM | `26.911.61220`, build `9647` | `aarch64` and `x86_64` package support; AArch64 authenticated reconstruction, supervised adoption, and renderer readiness. |

Fedora's vendor channel also offers build `10954`, with an ASAR byte-identical to Ubuntu's pristine
build, but its RPM stage and launch have not been qualified. Build `9647` remains the last
qualified Fedora target. TMTK keeps exact profiles for both builds while sharing the patch
implementations.

Windows tooling accepts both x64 and ARM64 package identities; the completed package and live
qualification used ARM64. Ubuntu and Fedora package adapters likewise accept their x86-family
architectures. An installing agent may use those paths after inspecting the official package's
exact inner build and passing the normal stage and adoption gates; lack of an x86-family lab run
is an evidence boundary, not an architecture restriction.

An `active` patch is maintained on the current branch. That does not mean it is installed locally
or compatible with an unnamed build. See [platform compatibility](docs/platform-compatibility.md)
before porting or adopting a candidate.

## Ordinary use

Inspect the checkout before updating it; preserve local work rather than discarding a dirty tree.

```sh
git status --short
git pull --ff-only
npm install
npm run check
npm test
```

Copy the platform example to the ignored `toolkit.local.json` and replace every fictional path.
The example is schema-bearing documentation, not a runnable configuration.

For a qualified macOS build:

```sh
cp examples/toolkit.macos.example.json toolkit.local.json

node bin/toolkit.mjs inspect /path/to/Pristine-ChatGPT.app
node bin/toolkit.mjs stage-macos /path/to/Pristine-ChatGPT.app \
  /path/to/ChatGPT-MechanicsToolkit.app \
  --config toolkit.local.json

bin/tmtk-restart --candidate /path/to/ChatGPT-MechanicsToolkit.app \
  /Applications/ChatGPT.app
```

`npm install` prepares TMTK; it does not patch Codex. Staging creates and verifies a separate
candidate without launching it. `tmtk-restart` is the separate adoption boundary: it verifies the
candidate and known-working application, waits for explicit operator confirmation, replaces the
canonical app, and requires renderer readiness. See [usage](docs/usage.md),
[staging](docs/staging.md), and [safe restart](docs/safe-start.md) for every platform's commands.

When an exact offered build is not qualified, port the selected fleet or wait. Never broaden a
matcher merely to make a new build pass. The maintainer workflow is in
[maintenance](docs/maintenance.md); macOS update selection is in
[the update workflow](docs/macos-update-workflow.md).

After acceptance, keep at most one pristine vendor artifact and one current candidate. Delete
superseded applications, packages, extracted trees, and transaction-only rollback payloads.

## Desktop patch catalog

The root table is an index. Each patch README owns its behavior, generated-code seam, exact
evidence, configuration, and non-goals.

| Patch | Effect |
| --- | --- |
| [Agent roster](patches/agent-roster/) | Supplies exact runtime task identity and per-agent settings from project-owned roster files. |
| [Runtime JSON reload](patches/runtime-json-reload/) | Applies valid roster changes after save without restarting Codex. |
| [Task visual palette](patches/task-visual-palette/) | Gives configured tasks stable colors, identity chips, selected-row accents, and optional sigils. |
| [Cross-task attribution](patches/cross-task-attribution/) | Names the real sending task on delegated messages. |
| [Outgoing-message receipt](patches/outgoing-message-receipt/) | Persists a compact chronological record of successful cross-task sends. |
| [Wait-thread roster](patches/wait-thread-roster/) | Renders active waits as linked, colored task names with explicit unknown fallbacks. |
| [Reasoning retention](patches/reasoning-retention/) | Keeps completed reasoning open for opted-in exact task IDs while preserving manual collapse. |
| [Model identity guard](patches/model-identity-guard/) | Blocks input when a pinned task silently changes model or reasoning effort. |
| [Task attention policy](patches/task-attention-policy/) | Mutes selected ordinary completion notifications without hiding failures or output. |
| [Sidebar action collapse](patches/sidebar-action-collapse/) | Collapses global sidebar actions while leaving projects and tasks visible. |
| [Terminal toggle](patches/terminal-toggle/) | Makes the configured terminal shortcut work from both the composer and focused terminal. |
| [TinRelay presentation](patches/tinrelay-pointer-presentation/) | Renders verified incoming and accepted outgoing TinRelay correspondence in the conversation. |
| [macOS menu title](patches/macos-menu-title/) | Restores `Codex` as the leading macOS application-menu label. |
| [Native app-tools peer authorization](patches/native-app-tools-peer-authorization/) | Preserves native task tools after a narrow local repair and re-signing. |
| [Codex observability](patches/codex-observability/) | Exposes bounded local CDP, renderer metrics, CPU profiles, and timeline traces. |
| [Renderer turn window](patches/renderer-turn-window/) | Bounds mounted completed turns without truncating transcript storage or export. |
| [Patched Codex binary integration](patches/standalone-output-compaction/) | Verifies and installs a separately built, same-version `codex` executable into a staged package. |
| [Safe-start readiness](patches/safe-start-readiness/) | Publishes the one-use renderer-ready signal consumed by supervised adoption. |
| [Renderer patch registry](patches/renderer-patch-registry/) | Publishes stable versioned presence descriptors for the mounted patch fleet. |

TMTK also documents one macOS preference that restores Codex Computer Use targeting Codex itself;
it is not an ASAR patch. See
[Computer Use self-target restoration](docs/safe-start.md#computer-use-self-target-restoration).

## Codex source patches

Desktop package transforms and open-source Codex repairs are separate layers. A source patch applies
an exact diff to an exact upstream checkout, runs its focused Rust tests, and produces a binary.
Desktop staging may then verify and place that same-version binary into a candidate.

| Source patch | Qualified source | Repair |
| --- | --- | --- |
| [Standalone-output compaction](source-patches/standalone-output-compaction/) | Codex CLI `0.155.0-alpha.16.4` / Desktop `26.917.71314` build `10954` on macOS | Preserves the current standalone external instruction when that same turn triggers compaction. |

## Documentation map

- [Usage](docs/usage.md): commands and configuration for ordinary operation.
- [Staging](docs/staging.md): candidate construction and static acceptance.
- [Safe restart and rescue](docs/safe-start.md): adoption, readiness, rollback, and terminal recovery.
- [Platform compatibility](docs/platform-compatibility.md): shared versus platform-owned seams.
- [Upgrading](UPGRADING.md): release-to-release operator changes.
- [Maintenance](docs/maintenance.md): porting exact upstream builds and closing the workbench.
- [Extraction ledger](docs/extraction-ledger.md): current qualification evidence and provenance.
- [Qualification runbooks](qualification/): maintainer-only platform procedures, including deliberate failure fixtures.
- [Contributing](CONTRIBUTING.md) and [security](SECURITY.md): repository boundaries and reporting.

Qualification runbooks are not ordinary installation instructions. Adopters of an already-qualified
build should stage the selected fleet, perform one healthy supervised adoption, and verify the
changed behavior—not recreate destructive recovery fixtures.

## Repository boundary

Inspection, transformation, staging, replacement, launch, and live acceptance are separate actions.
Repository evidence grants none of those machine mutations by itself. Keep local identities,
configuration, credentials, and user data out of this public repository.

This independent project is not affiliated with or endorsed by OpenAI. The [MIT license](LICENSE)
covers TMTK's work, not the upstream application it modifies.
