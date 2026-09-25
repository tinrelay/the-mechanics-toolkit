import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {sourcePatchDefinition} from "../src/source-patch-catalog.mjs";
import {applySourcePatch, sourcePatchState} from "../src/source-patch.mjs";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "tmtk-source-patch-"));
try {
  const checkout = path.join(scratch, "codex");
  fs.mkdirSync(checkout);
  run(checkout, ["init", "-q"]);
  run(checkout, ["config", "core.autocrlf", "false"]);
  run(checkout, ["config", "user.email", "test@example.invalid"]);
  run(checkout, ["config", "user.name", "TMTK Test"]);
  fs.writeFileSync(path.join(checkout, "source.txt"), "before\n");
  run(checkout, ["add", "source.txt"]);
  run(checkout, ["commit", "-qm", "base"]);
  const commit = run(checkout, ["rev-parse", "HEAD"]).stdout.trim();

  const patchFile = path.join(scratch, "change.patch");
  fs.writeFileSync(path.join(checkout, "source.txt"), "after\n");
  fs.writeFileSync(patchFile, run(checkout, ["diff", "--", "source.txt"]).stdout);
  run(checkout, ["restore", "source.txt"]);

  const definition = {
    name: "fixture",
    patch: "change.patch",
    upstream: "https://example.invalid/codex",
    tag: "fixture-v1",
    commit,
    desktop: {version: "1", build: "2"},
    files: {
      "source.txt": {before: hash("before\n"), after: hash("after\n")}
    }
  };

  assert.equal(sourcePatchState({definition, checkoutRoot: checkout, repositoryRoot: scratch}).state, "needs-apply");
  assert.equal(applySourcePatch({definition, checkoutRoot: checkout, repositoryRoot: scratch}).state, "applied");
  assert.equal(applySourcePatch({definition, checkoutRoot: checkout, repositoryRoot: scratch}).state, "applied");

  fs.writeFileSync(path.join(checkout, "source.txt"), "local change\n");
  assert.equal(sourcePatchState({definition, checkoutRoot: checkout, repositoryRoot: scratch}).state, "incompatible");
  assert.throws(
    () => applySourcePatch({definition, checkoutRoot: checkout, repositoryRoot: scratch}),
    /do not match either the qualified before or after state/
  );

  const queryCheckout = path.join(scratch, "query-depth");
  const queryFile = "codex-rs/chatgpt/src/lib.rs";
  const stockCrate = "pub mod apply_command;\nmod chatgpt_client;\npub mod connectors;\npub mod get_task;\n";
  fs.mkdirSync(path.dirname(path.join(queryCheckout, queryFile)), {recursive: true});
  run(queryCheckout, ["init", "-q"]);
  run(queryCheckout, ["config", "user.email", "test@example.invalid"]);
  run(queryCheckout, ["config", "user.name", "TMTK Test"]);
  fs.writeFileSync(path.join(queryCheckout, queryFile), stockCrate);
  run(queryCheckout, ["add", queryFile]);
  run(queryCheckout, ["commit", "-qm", "stock crate"]);
  const queryDefinition = {
    ...sourcePatchDefinition("chatgpt-query-depth-10954"),
    commit: run(queryCheckout, ["rev-parse", "HEAD"]).stdout.trim()
  };
  assert.equal(sourcePatchState({definition: queryDefinition, checkoutRoot: queryCheckout,
    repositoryRoot: repository}).state, "needs-apply");
  assert.equal(applySourcePatch({definition: queryDefinition, checkoutRoot: queryCheckout,
    repositoryRoot: repository}).state, "applied");
  assert.equal(fs.readFileSync(path.join(queryCheckout, queryFile), "utf8"),
    `#![recursion_limit = "256"]\n\n${stockCrate}`);
  assert.equal(applySourcePatch({definition: queryDefinition, checkoutRoot: queryCheckout,
    repositoryRoot: repository}).state, "applied");
} finally {
  fs.rmSync(scratch, {recursive: true, force: true});
}

function run(cwd, args) {
  const result = spawnSync("git", ["-C", cwd, ...args], {encoding: "utf8"});
  assert.equal(result.status, 0, result.stderr);
  return result;
}

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
