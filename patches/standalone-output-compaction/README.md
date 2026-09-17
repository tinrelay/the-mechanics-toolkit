# Patched Codex binary integration

Installs explicitly supplied, separately built `codex` executables into a staged Codex Desktop
candidate. This is the package-integration half of the
[standalone-output compaction source repair](../../source-patches/standalone-output-compaction/);
it does not patch or build Rust source.

On macOS, set `codexBinary` in the private toolkit config to the absolute path of the built
executable. On Windows, set `windows.codexBinaries.native` and `windows.codexBinaries.wsl` to the
absolute paths of the separately built native and WSL executables. Enable the catalog entry
`standalone-output-compaction`. During the ordinary staging flow, this transform:

1. requires each vendor and replacement executable to start with `--version`;
2. refuses a replacement whose reported CLI version differs from the vendor bundle;
3. copies each replacement to its exact packaged executable path in the staged candidate only;
4. preserves the executable mode and verifies the exact replacement SHA-256; and
5. lets the complete app staging pass sign and re-verify the candidate.

```json
{
  "enabledPatches": ["standalone-output-compaction"],
  "codexBinary": "/absolute/path/to/codex-rs/target/release/codex"
}
```

```json
{
  "enabledPatches": ["standalone-output-compaction"],
  "windows": {
    "codexBinaries": {
      "native": "C:\\absolute\\path\\to\\codex.exe",
      "wsl": "C:\\absolute\\path\\to\\codex"
    }
  }
}
```

The input binary is not accepted merely because it has the right version string. Its source,
tests, build provenance, and fitness remain the operator agent's responsibility. The same-version
check prevents an obvious incompatible package, while the source patch's own README provides the
qualified source and verification procedure.

Rollback restores the untouched vendor application payload. The toolkit never distributes the
built binaries or modifies a live application during staging.
