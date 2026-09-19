const definitions = [
  {
    name: "standalone-output-compaction",
    patch: "source-patches/standalone-output-compaction/codex-0.155.0-alpha.9.2.patch",
    upstream: "https://github.com/openai/codex",
    tag: "rust-v0.155.0-alpha.9.2",
    commit: "4607249e430dac1c961df4dc615beae88e33cec8",
    desktop: {version: "26.915.31945", build: "9922"},
    files: {
      "codex-rs/core/src/compact.rs": {
        before: "ff7de5a0d3e40004504c4cf1ce92bd5fdcd7c1902d3149df3ffd77174bb881da",
        after: "3fcd5cf60aaea23dab1e89b737acee8addc949ddda2a8a21c2ad817d2f186ddd"
      },
      "codex-rs/core/src/compact_remote_v2.rs": {
        before: "ac0b2f6a2eac964081c1f20675c02b78cab2cd4fa5fd7152ed357f9a884f55c9",
        after: "ebbe8d69eaf2b90bdc1ffa3b6d8667c16b2bd8599f3f39d4ce1d1f63039a490d"
      },
      "codex-rs/core/src/compact_tests.rs": {
        before: "e55d801309448fa9de1e041ef56dc416bcc72ea4d1daf23d2655c1d05cc848c7",
        after: "f2e5f54fec75392953e72329aecb15b6d49b1d12e9b892999aa19068d239825b"
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
