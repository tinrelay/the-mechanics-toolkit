# Dot lifecycle protection

Active, opt-in protection for cloud dots in the patched Desktop. It suppresses Delete/Reboot menu
actions and guards the central deletion function (including retries) and reboot request, so a
previously opened confirmation cannot bypass a newly loaded policy.

Use an `agents` entry in `.codex/agent-roster.json`. `taskId` is the dot's conversation UUID;
`orbitId` is the separate opaque cloud-agent identity, copied intact from authoritative metadata.
The flags are independent of palette colors and other agent policies:

```json
{
  "version": 1,
  "agents": {
    "example-dot": {
      "name": "Example Dot",
      "taskId": "11111111-2222-4333-8444-555555555555",
      "orbitId": "opaque-example-dot~instance",
      "protectDeletion": true,
      "protectReboot": true
    }
  },
  "tasks": {}
}
```

Deletion matches cloud identity, protecting all conversations owned by that dot. Reboot resolves
the selected conversation's current cloud identity; before that metadata is available, the exact
configured conversation is protected. Each guard reads the current roster at invocation, including
the request-time reboot assertion. Invalid dot policy throws rather than authorizing a mutation.
Removing an entry or setting a flag false deliberately restores the corresponding native action.

The shared task-label capability receives the exact conversation ID and preserves a registered
dot's full native title (or configured name when no title is hydrated), without a project prefix.
Unregistered ordinary tasks retain their existing labels. This does not establish dot support for
local task messaging or waits; it only names an identified dot wherever those existing surfaces
already carry its identity.

No native color/character, model selection, reasoning, pause/resume, or current-work stop behavior
is changed. These guards cover this patched desktop, not web/mobile clients or service-side actions.
Current exact package compatibility belongs in the [extraction ledger](../../docs/extraction-ledger.md).
Verification is `node test/dot-lifecycle-protection-transform.test.mjs` and the catalog's packed
behavioral probe; live acceptance never requires actually deleting or rebooting a protected dot.
