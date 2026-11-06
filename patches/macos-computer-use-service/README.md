# macOS Computer Use service authorization

- **Current state:** Active, opt-in macOS repair
- **Compatibility:** Exact helper image in the extraction ledger; unknown images fail closed

The vendor-signed Computer Use service rejects a locally built replacement Codex CLI as an
untrusted parent. This breaks the native pipe before the ordinary Computer Use request can run.
The browser and host-service pipes have a separate repair in
[native-app-tools-peer-authorization](../native-app-tools-peer-authorization/README.md).
That repair also relocates the native client/service socket to a private Codex-owned directory;
local re-signing does not confer access to the vendor's protected group container.

This patch owns the bundled `@oai/sky/Codex Computer Use.app` helper. It removes the helper's
parent/ancestor signature gate. It keeps the separate immediate-peer requirement pinned to the
vendor Team ID `2DC432GLL2`; unsigned and locally signed socket clients remain rejected.
This deliberately permits a vendor-signed Node runtime under locally signed ancestry. It does
not prove that the calling local process is the original vendor Codex application.

Re-signing also removes restricted vendor application/team/keychain identity entitlements that a
local certificate cannot claim. The transport's original same-team requirement becomes an
explicit vendor-team requirement, so re-signing does not make the helper trust the local signer
instead. Lock-screen authorization, per-app approvals, and macOS privacy permissions remain
separate owners. A changed local signing identity may require the operator to grant macOS access
again. The transform does not grant or reset privacy permissions; supervised adoption handles
the stale-grant transition described below.

## Staging

Add `macos-computer-use-service` to an explicit macOS toolkit configuration alongside
`native-app-tools-peer-authorization`, with a persistent certificate in `signingIdentity`.
Ad-hoc (`-`) signing is refused because its build-specific requirement would repeatedly invalidate
privacy grants. Reuse the same local certificate across updates. The supplied app must be a disposable staged application.
The patch re-signs only its bundled helper with the configuration's `signingIdentity`; ordinary
macOS staging signs and verifies the containing application afterward. The default example does
not opt into this security-policy relaxation.

```sh
node bin/toolkit.mjs patch macos-computer-use-service check /path/to/staged.app --config /path/to/toolkit.json
node bin/toolkit.mjs patch macos-computer-use-service apply /path/to/staged.app --config /path/to/toolkit.json
node test/macos-computer-use-service.test.mjs /path/to/staged.app
```

Codex refreshes its canonical user-local Computer Use helper from the bundled copy at startup.
Adopt the staged Desktop through `tmtk-restart`; do not patch the running helper as an independent
installation workflow. A staged check does not establish native or browser readiness.
Before launching a repaired helper with a different signing requirement from the canonical
installed helper, the macOS supervisor clears only its stale Screen Recording/Accessibility
grants through `tccutil`. The next approval binds to the current certificate. Matching signing
requirements preserve all grants, including across changed builds. No TCC database is edited.
The incoming helper must match the qualified image; the previous helper does not need to be the
same Desktop version. Stock/vendor, older ad-hoc TMTK, and missing-helper starting states all
receive scoped first-transition handling. Each machine uses its own persistent certificate;
no certificate or private key from the maintainer is required. After the one-time macOS approvals,
reuse that identity for subsequent TMTK updates.

## Verification

The entire Mach-O payload is pinned, excluding only its replaceable code signature. Partial
repairs, changed instructions/data, another architecture, and future helper images fail closed.
Reapplication preserves signed bytes. The exact causal probe runs a disposable helper on a private
socket: stock parent authorization rejects the vendor Node client under local ancestry; the repair
answers its version ping, while an unsigned Python client still cannot connect. A real Computer
Use inventory has also succeeded with the repaired service. Browser acceptance and macOS privacy
access remain distinct live checks.
