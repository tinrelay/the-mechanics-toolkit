# Staging and authority

The staging command builds evidence, not permission. It creates a new, disposable candidate and
does not install, replace, launch, publish, or deploy it.

## macOS inputs

- a valid `com.openai.codex` source bundle whose code signature and Electron ASAR-header seal pass;
- a nonexistent destination outside `/Applications`, under an existing directory;
- an ignored toolkit config with a nonempty, duplicate-free `enabledPatches` list;
- when a source repair is selected, an absolute `codexBinary` path to the separately built and
  verified same-version executable;
- dependencies installed with `npm install`, including the pinned repository-local Electron ASAR
  tool, plus the macOS system tools `codesign`, `ditto`, and `PlistBuddy`.

Linux DEB and RPM inputs and tools are specified in
[Linux package staging and adoption](#linux-package-staging-and-adoption).
Windows MSIX inputs and tools are specified in [Windows MSIX staging and adoption](#windows-msix-staging-and-adoption).

Configuration-backed patches read their ordinary sections from the same file. The palette requires
cross-task attribution in the selection. Patch order comes from the toolkit catalog, not from array
order. Every staged fleet must include `safe-start-readiness`, because the adoption supervisor
accepts a candidate only after that trusted renderer signal, and `renderer-patch-registry`, which
runs after the behavior transforms and records the completed selected surface. These are staging
infrastructure, including when the user-facing selection would otherwise change only bundle
metadata.

The staging command does not apply Rust source patches or build Codex. Follow the selected entry in
[`source-patches/`](../source-patches/) first. Its compiled result becomes a package input only
through the explicit `codexBinary` configuration; the integration transform places it at
`Contents/Resources/codex` before the candidate is signed.

For an offered update, prefer the untouched application from the official vendor installer as the
source. The running installed application may remain open throughout staging. A staged candidate
may be named `ChatGPT-MechanicsToolkit.app`, but it stays outside `/Applications` and unlaunched; it
is not a second live application. See [preparing a patched macOS Codex update](macos-update-workflow.md).

## Static proof

The source is inspected before copying and again before success returns. Inside the new candidate,
the command:

1. requires each selected transform to report `needs-apply`;
2. applies every selected transform and requires `applied`;
3. syntax-checks all declared changed JavaScript modules;
4. runs every selected patch's focused behavioral probe;
5. applies the transforms again and compares every extracted file, symlink, and mode;
6. requires the exact recognized native-package set, preserves its complete tree, repacks it, and
   verifies the node-pty helper is executable;
7. on macOS, updates Electron's raw ASAR-header SHA-256 value and signs the candidate with the
   configured identity (ad-hoc by default); on Linux, writes explicit local-rebuild control fields
   and a receipt without claiming the vendor signature;
8. verifies the platform package identity and version/build preservation, plus the macOS integrity
   seal and signature where applicable;
9. extracts the packed result and reruns patch checks, syntax checks, and behavioral probes.

Failure removes only the new destination that this invocation created. The source is never a write
target. A green result says `staged-static-proof-green`, `liveAppTouched: false`, and `launched:
false` because runtime behavior remains deliberately unclaimed.

## Next seam

Launching the candidate is a separate operator decision. After explicit authority, the macOS
supervisor can own the adoption boundary:

```sh
bin/tmtk-restart --candidate /path/to/ChatGPT-MechanicsToolkit.app \
  /Applications/ChatGPT.app
```

It verifies the candidate and current app, captures the current app as a private known-working
rollback, and does not replace anything until the person clicks **Relaunch Codex**. Do not retain a
separately named live copy with the same bundle identifier. Neither adoption nor launch is implied
by a successful stage.

### Linux package staging and adoption

Linux DEB and RPM staging use the same config and selected-patch contract, but their inputs and
outputs are packages rather than application directories:

```sh
node bin/toolkit.mjs stage-deb /path/to/chatgpt_amd64.deb \
  /path/to/chatgpt_amd64_tmtk.deb --config "$CONFIG"

node bin/toolkit.mjs stage-rpm /path/to/chatgpt_x86_64.rpm \
  /path/to/chatgpt_x86_64_tmtk.rpm --config "$CONFIG"
```

Both commands require an authenticated official `chatgpt` package and a nonexistent destination.
DEB staging uses `dpkg-deb`, `ar`, `gpgv`, and the trusted ChatGPT APT keyring at
`/usr/share/keyrings/chatgpt-archive-keyring.gpg`; it verifies the embedded `_gpgorigin` signature
over the raw archive members. RPM staging uses `rpm`, `rpmkeys`, `rpm2cpio`, `cpio`, and `rpmbuild`;
it compares the package signature fingerprint to the installed ChatGPT RPM key at
`/etc/pki/rpm-gpg/RPM-GPG-KEY-chatgpt-3BFA0E4AE8B8CC16A2D9BA684A3B4A566C4660E4.asc`.
Neither path imports trust from the package it is authenticating or exposes a bypass flag.

The shared Linux stager extracts without installing, accepts ASAR-scope patches only, preserves the
unpacked native tree and every non-owned package payload, and writes an explicit TMTK package
receipt. It rebuilds the DEB as local `SOURCE+tmtk1` and the RPM as local
`SOURCE_RELEASE.tmtk1`; neither local artifact claims the vendor signature. The source stays
byte-identical. Green results are `staged-deb-static-proof-green` and
`staged-rpm-static-proof-green`, and both still mean `installed: false` and `launched: false`.
If a future official package uses a key absent from the installed trust path, refresh trust only
through OpenAI's authenticated vendor repository.

Supervised Linux adoption names the candidate's pristine source separately from the rollback that
matches the currently installed application:

```sh
bin/tmtk-restart --candidate /path/to/chatgpt_amd64_tmtk.deb \
  --candidate-source /path/to/new-chatgpt_amd64.deb \
  --known-good /path/to/installed-chatgpt_amd64.deb /usr/lib/chatgpt

bin/tmtk-restart --candidate /path/to/chatgpt_x86_64_tmtk.rpm \
  --candidate-source /path/to/new-chatgpt_x86_64.rpm \
  --known-good /path/to/installed-chatgpt_x86_64.rpm /usr/lib/chatgpt
```

All three paths in one adoption must use the same package format. `--candidate-source` must pass
that format's vendor-signature check. A receipt-free `--known-good` must pass the same check; a
receipted TMTK rollback is instead verified against its strict package receipt. The candidate
receipt must identify `--candidate-source` by version, architecture, and SHA-256, and the currently
installed inner application must match `--known-good`. The source and rollback may be different
releases during an ordinary upgrade. TMTK copies the candidate and rollback into its private
incident before the restart dialog. An ordinary desktop user authenticates through the selected
native dialog and exact `sudo -A dpkg --install` or
`sudo -A rpm --upgrade --replacepkgs --oldpackage`, followed by package-database and inner-app
verification. A future higher version from the configured vendor repository may replace the local
rebuild.

### Windows MSIX staging and adoption

Windows staging runs on Windows with two exact `OpenAI.Codex` sources: an authenticated pristine
package for the candidate and the currently installed, live-proven package for rollback. Start from
[`toolkit.windows.example.json`](../examples/toolkit.windows.example.json); its values are
placeholders, not a runnable local configuration. The config's `windows` object supplies four-part
`candidateVersion` and `knownGoodVersion` values, absolute `makeAppx` and `signTool` paths, a trusted
SHA-1 signing-certificate thumbprint, and both native and WSL Codex binaries when the
standalone-output repair is selected.

```powershell
node bin/toolkit.mjs stage-msix `
  $PristineCandidateSource $InstalledKnownGoodSource $CandidateMsix $KnownGoodMsix `
  --config $ToolkitConfig
```

The command preserves the exact package family and application identity, applies and verifies the
selected ASAR fleet, compares native and non-owned payloads, rebuilds the MSIX block map, signs both
outputs, and fully re-extracts them for verification. These are locally signed qualification and
adoption packages, not Microsoft Store artifacts or distributable OpenAI updates.

The qualified supervisor route is:

```powershell
node bin/tmtk-restart `
  --candidate $CandidateMsix --known-good $KnownGoodMsix `
  -- $InstalledPackageRoot
```

The sources must have the exact same package family, publisher, architecture, application identity,
and inner Desktop version/build/Electron. The candidate receives the selected canonical patch fleet
from pristine bytes. The known-good output preserves the installed source payload while changing
only package reconstruction metadata, its monotonic outer version, and its local signature.
Adoption rechecks that the supplied known-good package reproduces the currently installed inner
identity and fails before restart when it does not. See
[`qualification/windows.md`](../qualification/windows.md).

The staging command removes its own extracted-ASAR scratch tree on both success and failure. The
explicit destination candidate remains operator-owned. The restart supervisor keeps its private
candidate and rollback copies only while replacement is active, removes them when readiness or a
successful restore completes the transaction, and prunes leftovers from older interrupted incidents
on the next adoption. Maintainer-created `.work`
trees are evidence benches, not an automatic cache; keep only the pristine input, current candidate,
and deliberate failure fixtures still needed for qualification. After live acceptance, delete the
candidate and unpacked source, remove prior-release work, and retain at most one pristine vendor ZIP
if another staging pass may be useful.
