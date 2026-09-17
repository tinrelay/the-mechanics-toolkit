const definitions = [
  {
    name: "standalone-output-compaction",
    patch: "source-patches/standalone-output-compaction/codex-0.155.0-alpha.2.6.patch",
    upstream: "https://github.com/openai/codex",
    tag: "rust-v0.155.0-alpha.2.6",
    commit: "bf6f0a4ec97919bf697cdc532e7b8af4ec482fc6",
    desktop: {version: "26.911.61220", build: "9647"},
    files: {
      "codex-rs/core/src/compact.rs": {
        before: "a8f9d29ec56ff5371c1efafb408ed149e9a14a87a44dfc6d461b9068389278c4",
        after: "e9bfdb1346d52cd0bf4c5de23813f9ecc2b62a7ceb1c47890b3d74ac2c4b7f76"
      },
      "codex-rs/core/src/compact_remote_v2.rs": {
        before: "34cb3b7b3cd172d8e2125feca408fe8e314c39f4dd29721ed54f92462ca4f25c",
        after: "221053aa574cfced0b2702124cb1296251af9b5c1dc468394faa18497cc2c7da"
      },
      "codex-rs/core/src/compact_tests.rs": {
        before: "c43a034ae9b7eba2b931d1f1b839c1d182775eb8e0a65f7773986a0bf7bfd868",
        after: "c8f5f60556b3c34152536f534517590efc135d48d764f7101026327480d8fa40"
      }
    }
  }
];

if (new Set(definitions.map(definition => definition.name)).size !== definitions.length) {
  throw new Error("Source patch catalog contains duplicate names");
}

export const sourcePatchDefinitions = Object.freeze(definitions.map(definition => Object.freeze({
  ...definition,
  desktop: Object.freeze({...definition.desktop}),
  files: Object.freeze(Object.fromEntries(
    Object.entries(definition.files).map(([file, hashes]) => [file, Object.freeze({...hashes})])
  ))
})));

export function sourcePatchDefinition(name) {
  return sourcePatchDefinitions.find(definition => definition.name === name) ?? null;
}
