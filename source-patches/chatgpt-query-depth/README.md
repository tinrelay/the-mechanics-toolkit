# Codex ChatGPT query depth

Build-only repair for Codex CLI `0.155.0-alpha.16.4` at commit
`3853cf0c49daadcacaacceb2cbb732f512eaacdb`, bundled by macOS Desktop
`26.917.71314` / build `10954`. On another ARM64 macOS build host, stable Rust `1.95.0`
reported `queries overflow the depth limit` while laying out
`connectors::list_connectors()` in `codex-chatgpt`. The compiler requested a crate-level
`#![recursion_limit = "256"]` attribute. Another host built the same release without it, so the
cross-host cause remains unknown; the diagnostic and successful compile with a higher limit establish
the narrow build boundary.

This patch adds only that stable Rust attribute to `codex-rs/chatgpt/src/lib.rs`. It neither changes
the standalone-output compaction behavior nor requires `RUSTC_BOOTSTRAP` or unstable `RUSTFLAGS`.
The source-patch command requires the exact upstream commit and before/after file hashes; it fails
closed on an altered crate root.

```sh
node bin/toolkit.mjs source-patch chatgpt-query-depth-10954 check /path/to/codex
node bin/toolkit.mjs source-patch chatgpt-query-depth-10954 apply /path/to/codex
node bin/toolkit.mjs source-patch standalone-output-compaction-10954 apply /path/to/codex
bin/tmtk-build-codex /path/to/codex
```

The two source patches touch disjoint files and may be applied in either order. Run the focused
compaction tests from [that patch's procedure](../standalone-output-compaction/README.md#build-and-verify)
before building. A full release build of the exact patched source passed locally on Rust `1.95.0`
with LTO off and no bootstrap or unstable flags. A successful compile is not desktop acceptance:
use the resulting local binary as `codexBinary` in a non-live candidate and pass the normal
staged-app and live gates. A different binary SHA-256 from another host's receipt is not a
rejection; TMTK verifies the exact binary supplied for staging and requires its reported CLI
version to match the vendor bundle.

This repair is limited to the exact source revision above. Do not carry the attribute to another
Codex version without a fresh compiler or source-owner check. TMTK distributes no compiled binary.
