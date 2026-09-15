#!/usr/bin/env node
import {runObservabilityCli} from "../src/codex-observability-client.mjs";

try {
  await runObservabilityCli(process.argv.slice(2));
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
