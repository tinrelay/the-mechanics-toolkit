# Native app-tools peer authorization

- **Current state:** Active
- **Public extraction:** Complete for the exact recognized main-process profiles
- **Fleet qualification:** See the [extraction ledger](../../docs/extraction-ledger.md).

## Why it exists

Codex's native app-tools server authenticates the process at the other end of its pipe with a
packaged native module. That check covers both the immediate peer and its process ancestry. After a
local ASAR repair, the outer application must be signed again; the official bundled Node helper can
then be rejected because its locally signed ancestor no longer has OpenAI's identity, even though
the immediate helper still does.

This patch leaves the stock result authoritative. It adds one fallback only to the native app-tools
server: a stock `missing-code-signing-identity` rejection becomes authorized when the immediate
peer has OpenAI Team ID `2DC432GLL2` and signing identifier `node` or `node_repl`. A stock success passes through
unchanged. An untrusted identity, another team, another executable, another rejection reason, or a
different native pipe remains rejected unless its exact owner is included below.

## Owned seam

The transform recognizes one main-process native app-tools server owner, its stock authorizer
default, the packaged `browser-use-peer-authorization.node` testimony, and the current rejection
contracts. In the current main-process profile it also wraps the exact browser, MCP Apps browser,
and Computer Use host-service pipe owners. These use the same native authorizer and otherwise
reject the vendor-signed runtime under a locally signed Codex parent. The native module, stock
successes, app access policy, and explicit caller-supplied authorizers remain stock owners.

The separately packaged macOS Computer Use service has its own signature gate. Its optional
[service repair](../macos-computer-use-service/README.md) is independent of this JavaScript wrapper.

The current macOS profile also gives the service and packaged Computer Use client the same
`SKY_CUA_SERVICE_NATIVE_PIPE_PATH`. Its default is
`CODEX_HOME/computer-use/tmtk-ipc/computeruse.sock`, in a dedicated directory kept at mode `0700`.
A locally signed service cannot open the original lock file in the vendor's protected group
container. Both sides derive the same default even if runtime configuration precedes helper
startup; an explicit socket override remains authoritative. No group-container data is moved or
made accessible.

On macOS build `26605`, the generated browser MCP configuration also keeps the packaged,
vendor-signed Node runtime alive as the immediate parent of the packaged Node REPL. The separate
Chrome extension host checks that parent and rejects the locally rebuilt CLI when it is directly
above the REPL. This launch arrangement satisfies the host's existing checks without changing its
binary, manifest, extension, browser profile or authentication policy. Runtime paths come from the
stock configuration builder; normal plugin setup regenerates the configuration after adoption.
Other platforms retain their existing launch configuration. MCP streams, executor environment,
child exit status and shutdown signals pass through the parent.

If the server owner, native module, Team ID, signing identifier, reason vocabulary, or surrounding
authorization testimony changes, the transform fails with `Upstream changed`. Those are security
evidence to inspect, not strings to update approximately.

## Check and apply

```sh
node bin/toolkit.mjs patch native-app-tools-peer-authorization check /path/to/extracted-asar
node bin/toolkit.mjs patch native-app-tools-peer-authorization apply /path/to/disposable-extracted-asar
node test/native-app-tools-peer-authorization.test.mjs /path/to/disposable-extracted-asar
```

No configuration is required. The patch command modifies only the supplied extracted tree. The
separate staging command can build and statically verify a new app outside `/Applications`; neither
command installs, launches, or replaces a working application. Runtime acceptance still requires a
native message to a known local task after a separately authorized rebuild and relaunch.

## Verification

`test/native-app-tools-peer-authorization-transform.test.mjs` constructs recognized pristine
main-process profiles. It proves red/green transformation, stock-success preservation, the exact
mixed-signature exception, retained negative cases, unchanged stock native-module ownership,
exact pipe-owner scope, syntax validity, and byte-identical second application.

The current browser-launch fixture additionally proves byte-for-byte MCP traffic, the actual
parent PID, executor environment, child exit status and shutdown without an orphaned child.
An exact-production-launcher probe against the unmodified current Chrome host rejects a direct
vendor client under the rebuilt CLI, accepts it with the vendor parent, and still rejects an
unsigned Python client. After supervised adoption, dedicated Chrome extension discovery,
disposable-tab creation/navigation, DOM reading and tab closure passed. The operator confirmed
the normal Chrome session appeared. This is separate from native Computer Use accessibility.

The private implementation was separately accepted after the app-tools migration: native
task-to-task ping/pong and browser control both worked under the locally signed application. That
is historical runtime evidence for the design, not proof that this separately namespaced public
transform is installed.

## Non-goals

- accepting an unsigned, ad-hoc-signed, differently signed, or differently named immediate peer;
- bypassing the native module or replacing its stock success path;
- granting browser/app access, disabling macOS privacy controls, or changing another pipe's authorization;
- trusting a task, prompt, environment variable, or local config to choose an allowed signer;
- claiming delivery, hydration, or app-server correctness after authorization succeeds;
- accepting an approximately matching future main process.
