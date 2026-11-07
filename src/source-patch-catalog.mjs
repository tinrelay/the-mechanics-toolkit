const definitions = [
  {
    "name": "standalone-output-compaction-25471",
    "patch": "source-patches/standalone-output-compaction/codex-0.167.0-alpha.3.2.patch",
    "upstream": "https://github.com/openai/codex",
    "tag": "rust-v0.167.0-alpha.3.2",
    "commit": "c40729ea5cf8e947481b130c59807273eda2f8e9",
    "desktop": {
      "version": "26.1103.32239",
      "build": "25471"
    },
    "files": {
      "codex-rs/core/src/compact.rs": {
        "before": "abc5cd5d1f2e9e8a415a04f27974dc39809939706ca413059a38dd56571a128f",
        "after": "f7da13ec9a5b93021d06c9ef9a4b46004589ef913fe26db36ad94708c47a423a"
      },
      "codex-rs/core/src/compact_remote_v2.rs": {
        "before": "29407e61ffd33104695968710dcc948e814ee7276766c37e0cca910b4c9e50b2",
        "after": "a0d797034efef7068a9c55e2f9133699dbc6bbc4f93aaddbff0a96dd18a03408"
      },
      "codex-rs/core/src/compact_tests.rs": {
        "before": "fbb2446cba6368ae8b2dd1af82de524fe5b2dd910ea3676b751cd29521067dab",
        "after": "16c4033ef5a4fe45f0df7431c44d72d2ed4cb0bd67df807bd8e63017dbd787b1"
      }
    }
  },
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
  },
  {
    name: "standalone-output-compaction-10789",
    patch: "source-patches/standalone-output-compaction/codex-0.155.0-alpha.9.2.patch",
    upstream: "https://github.com/openai/codex",
    tag: "rust-v0.155.0-alpha.16.3",
    commit: "ffa06df2317e3e65fc74da977a5884710c5382d5",
    desktop: {version: "26.917.62051", build: "10789"},
    files: {
      "codex-rs/core/src/compact.rs": {
        before: "11f2e4c58ba05fca1500903718f3f42d5941b678b2bf769479708fe20180bf72",
        after: "15638a3cd169866810aa2a25571eeb5330fd98ac4fdf553aeb7993232337c990"
      },
      "codex-rs/core/src/compact_remote_v2.rs": {
        before: "ac0b2f6a2eac964081c1f20675c02b78cab2cd4fa5fd7152ed357f9a884f55c9",
        after: "ebbe8d69eaf2b90bdc1ffa3b6d8667c16b2bd8599f3f39d4ce1d1f63039a490d"
      },
      "codex-rs/core/src/compact_tests.rs": {
        before: "05d74ca69874cb8b1b35dc3851bf7ed038d7012e2c8785c945ff35e66bb72b08",
        after: "9184b4844fe3025a6ba3f03f9779e07d1307a28af2022c4e458ea68de35d9068"
      }
    }
  },
  {
    name: "standalone-output-compaction-10954",
    patch: "source-patches/standalone-output-compaction/codex-0.155.0-alpha.9.2.patch",
    upstream: "https://github.com/openai/codex",
    tag: "rust-v0.155.0-alpha.16.4",
    commit: "3853cf0c49daadcacaacceb2cbb732f512eaacdb",
    desktop: {version: "26.917.71314", build: "10954"},
    files: {
      "codex-rs/core/src/compact.rs": {
        before: "11f2e4c58ba05fca1500903718f3f42d5941b678b2bf769479708fe20180bf72",
        after: "15638a3cd169866810aa2a25571eeb5330fd98ac4fdf553aeb7993232337c990"
      },
      "codex-rs/core/src/compact_remote_v2.rs": {
        before: "ac0b2f6a2eac964081c1f20675c02b78cab2cd4fa5fd7152ed357f9a884f55c9",
        after: "ebbe8d69eaf2b90bdc1ffa3b6d8667c16b2bd8599f3f39d4ce1d1f63039a490d"
      },
      "codex-rs/core/src/compact_tests.rs": {
        before: "05d74ca69874cb8b1b35dc3851bf7ed038d7012e2c8785c945ff35e66bb72b08",
        after: "9184b4844fe3025a6ba3f03f9779e07d1307a28af2022c4e458ea68de35d9068"
      }
    }
  },
  {
    name: "chatgpt-query-depth-10954",
    patch: "source-patches/chatgpt-query-depth/codex-0.155.0-alpha.16.4.patch",
    upstream: "https://github.com/openai/codex",
    tag: "rust-v0.155.0-alpha.16.4",
    commit: "3853cf0c49daadcacaacceb2cbb732f512eaacdb",
    desktop: {version: "26.917.71314", build: "10954"},
    files: {
      "codex-rs/chatgpt/src/lib.rs": {
        before: "49af859977cfabc54a894c927c86067d3532f98751ad18af0f4dfb2a3c25e955",
        after: "2c189062123edeb250f58a0ce17e79517189e88bebb349c9ebaba5c123a0f529"
      }
    }
  },
  {
    name: "standalone-output-compaction-11645",
    patch: "source-patches/standalone-output-compaction/codex-0.155.0-alpha.9.2.patch",
    upstream: "https://github.com/openai/codex",
    tag: "rust-v0.158.0-alpha.2.1",
    commit: "0d9c7cbfa6cf1489f55a8a9542b75ddd2c061807",
    desktop: {version: "26.924.22138", build: "11645"},
    files: {
      "codex-rs/core/src/compact.rs": {
        before: "726d80f12327e8b2a1a8a87cb2392001f314e7f6233aff09f7abf9b264348e08",
        after: "0210d78e88edaf7e64519f5f389a376f1fa74787abb2a60e274da3545bbe291d"
      },
      "codex-rs/core/src/compact_remote_v2.rs": {
        before: "6fc09ec7c3fb92a3e70a14d5592bfb1515200eb514bba38c8449d55359c344e2",
        after: "440e3e7562ae186965390069383ebc562eb20754656b689944cf520b505072f7"
      },
      "codex-rs/core/src/compact_tests.rs": {
        before: "05d74ca69874cb8b1b35dc3851bf7ed038d7012e2c8785c945ff35e66bb72b08",
        after: "9184b4844fe3025a6ba3f03f9779e07d1307a28af2022c4e458ea68de35d9068"
      }
    }
  },
  {
    name: "chatgpt-query-depth-11645",
    patch: "source-patches/chatgpt-query-depth/codex-0.155.0-alpha.16.4.patch",
    upstream: "https://github.com/openai/codex",
    tag: "rust-v0.158.0-alpha.2.1",
    commit: "0d9c7cbfa6cf1489f55a8a9542b75ddd2c061807",
    desktop: {version: "26.924.22138", build: "11645"},
    files: {
      "codex-rs/chatgpt/src/lib.rs": {
        before: "49af859977cfabc54a894c927c86067d3532f98751ad18af0f4dfb2a3c25e955",
        after: "2c189062123edeb250f58a0ce17e79517189e88bebb349c9ebaba5c123a0f529"
      }
    }
  },

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
