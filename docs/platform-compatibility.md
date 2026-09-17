# Desktop platform compatibility

The [extraction ledger](extraction-ledger.md#current-build-matrix) is the sole current platform and
build matrix. This document owns the durable cross-platform architecture: what can be shared, what
must remain platform-specific, and what evidence is required before a port is called qualified.
Exact package hashes and live results belong in the platform runbooks under
[`qualification/`](../qualification/).

Codex Desktop ships the same product through different generated JavaScript profiles and different
operating-system packages. A patch is portable only after three independent questions are answered:

1. does its transform recognize the generated code for this exact Desktop build and platform;
2. does the repaired behavior mean the same thing on that platform; and
3. can the result be repacked with honest platform integrity and provenance, then installed,
   launched, and recovered safely there?

A green answer to the first question is not evidence for the other two. Qualification names the
Desktop's inner application version and Codex build, operating system, architecture, package
format, and highest gate actually exercised.

## Repository ownership map

TMTK does not carry separate feature fleets for each operating system:

```text
patches/<feature>/                 shared behavior and exact generated-code transforms
patches/<feature>/profiles/        only proven platform-specific owner shapes
src/platforms/<platform>.mjs       lifecycle, process identity, dialogs, launch, and handoff
src/<platform-package>.mjs         package inspection, adoption, and rollback
src/stage-<platform-or-format>.mjs package-specific staging, integrity, and signing
qualification/<platform>.md        platform-owned live runbook and evidence contract
```

The ordinary port order is semantic first, adaptation second. Establish the feature behavior and
changed generated-code owners on one frontier package. Then apply that exact fleet to the other
official packages, reusing identical profiles and adding a narrow platform profile only when the
bytes prove the owner differs. Shared supervisor transitions stay shared; each adapter owns only
the operating-system mechanism that fulfills them.

## Generated code and architecture

The useful transform coordinate is:

```text
{inner Desktop version, Codex build, operating-system generated-code profile}
```

CPU architecture still matters for native modules, bundled executables, package identity, and live
qualification. It does not earn a second JavaScript profile when the generated assets are
byte-identical across architectures.

TMTK transforms already bundled and minified output. They match syntactically bounded semantic
owners, not byte offsets. A matcher may survive changed chunk filenames or minifier identifiers
when the complete owned shape is still recognized; it must not be widened merely because another
platform carries the same build number. Unknown, partial, duplicated, or split ownership fails
closed.

## Package boundaries

### macOS application bundles

[`stage-macos`](usage.md#stage-a-complete-candidate) copies a pristine `.app`, transforms and
repacks `app.asar`, updates Electron's ASAR-header seal in `Info.plist`, signs the complete
candidate, verifies it, and re-extracts it for post-pack probes. The staged candidate remains
outside `/Applications` and unlaunched until the restart supervisor receives separate authority.
The complete update path is in
[the macOS update workflow](macos-update-workflow.md).

### Linux distribution packages

Linux package adapters authenticate the vendor package through the distribution's trust path,
rebuild a local package around the transformed ASAR, preserve executable modes and native payload,
and record explicit local-rebuild provenance. They do not patch package-owned files in place or
claim the rebuilt result retains the vendor package signature. The supported formats and exact
adoption evidence are current only when named in the
[Linux runbook](../qualification/linux.md) and extraction ledger.

### Windows MSIX packages

Windows staging starts from an authenticated pristine candidate source and a separately preserved,
live-proven known-good source with the same inner Desktop identity. It preserves package family and
application identity, applies the shared ASAR fleet only to the pristine source, rebuilds the MSIX
block map, and signs monotonically versioned local qualification packages. The result is not a
Microsoft Store artifact or a distributable OpenAI update. Exact package, signing, supervisor, and
live gates belong in the [Windows runbook](../qualification/windows.md).

Electron's platform seal formats are documented in
[ASAR Integrity](https://www.electronjs.org/docs/latest/tutorial/asar-integrity).

## Porting and qualification order

For a new platform or build:

1. acquire the official package and preserve one pristine copy;
2. record outer package identity and inner application version/build separately;
3. compare generated assets without assuming matching chunk names;
4. run every selected transform's read-only check on a pristine extracted ASAR;
5. port only failed ownership profiles, reusing shared profiles when their complete owners match;
6. run transforms, syntax checks, behavioral probes, and byte-identical reapplication in a
   disposable extracted tree;
7. exercise the platform's integrity, package metadata, signature, install, update, and recovery
   adapter; and
8. perform live acceptance for the actual OS and architecture before calling the fleet qualified.

Static generated-code evidence can substantially reduce a port. It cannot erase the package and
runtime gates that keep the working Codex recoverable. Historical port details remain available in
Git history; they do not stay in current documentation or patch catalogs as alternate instructions.
