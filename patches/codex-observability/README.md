# Codex observability

- **Current state:** Active
- **Public extraction:** Complete
- **Qualified package:** Codex Desktop `26.908.40834` (`8881`), macOS ARM64 static, causal harness, and live renderer captures

## Why it exists

When a Codex task makes the entire renderer miss frames, process totals and DOM guesses cannot say
whether the time is going to JavaScript, garbage collection, style, layout, paint, or Chromium
work. Reconstructing a debugging route during each incident wastes the moment when the failure is
actually visible.

This patch leaves a small, permanent observability entrance in the main process. An operator or
local agent can enumerate current `webContents`, open DevTools, issue an explicit Chrome DevTools
Protocol command, read renderer performance metrics, or make a bounded CPU profile or timeline
trace. The bridge does not poll, observe the DOM, profile, or trace while idle.

## Owned seam

After Electron's exact app-ready boundary, the patch starts a local Node socket at
`~/.codex/tmtk-observability/control.sock` on POSIX systems. Windows uses a user-derived named-pipe
name. The POSIX directory is mode `0700` and the socket is mode `0600`; an unexpected file,
ownership mismatch, live listener, partial patch, or changed main-process owner disables the bridge
instead of broadening access. Each request selects one current Electron `webContents` ID.

Debugger attachment is request-scoped. Success, CDP failure, timeout, target destruction, and
client disconnect all detach it. Opening ordinary DevTools while a capture owns the debugger, or
starting a capture while DevTools owns it, fails visibly because Electron permits only one debugger
attachment.

The bridge is deliberately powerful. A same-user process with access to it can inspect or alter
renderer state through CDP. It never listens on TCP, accepts remote clients, uploads captures, or
writes capture files itself. The CLI creates only the explicitly named new output file and refuses
to overwrite an existing path.

## Use

Install the repository package links or invoke the executable from this checkout:

```sh
bin/tmtk-observe.mjs list
bin/tmtk-observe.mjs metrics TARGET_ID
bin/tmtk-observe.mjs devtools TARGET_ID
bin/tmtk-observe.mjs cdp TARGET_ID Runtime.evaluate '{"expression":"document.body.childElementCount","returnByValue":true}'
bin/tmtk-observe.mjs cpu-profile TARGET_ID 10 codex.cpuprofile
bin/tmtk-observe.mjs trace TARGET_ID 10 codex-trace.json
```

Durations may be fractional seconds and are capped at 60 seconds. A CPU profile uses a 1 ms
sampling interval by default; an optional final argument selects 100 through 10000 microseconds.
Load `.cpuprofile` and trace `.json` files in Chrome DevTools. The trace includes the timeline,
disabled-by-default timeline details and high-resolution V8 CPU samples, V8 execution, Blink,
user timing, compositor, and GPU
categories needed to investigate whole-renderer stalls such as sidebar hover lag.

## Check and apply

```sh
node bin/toolkit.mjs patch codex-observability check /path/to/extracted-asar
node bin/toolkit.mjs patch codex-observability apply /path/to/disposable-extracted-asar
node test/codex-observability.test.mjs /path/to/disposable-extracted-asar
```

The patch is configuration-free. Applying it changes only the explicit extracted ASAR tree; staging,
installation, restart, and live attachment remain separate actions.

## Verification

`test/codex-observability-transform.test.mjs` proves exact main-process ownership, all published
operations, syntax validity, partial-state refusal, and byte-identical second application.
`test/codex-observability.test.mjs` starts the injected bridge against a fake Electron target and
causally exercises enumeration, metrics, generic CDP, CPU profiling, streamed tracing, DevTools,
private socket modes, malformed input, disposal, and debugger detachment. The separate client test
proves endpoint agreement, new-file-only captures, trace streaming, and command framing.

## Non-goals

- always-on telemetry, sampling, logging, or DOM observation;
- a remote-debugging TCP port or browser-accessible endpoint;
- automatic capture, diagnosis, or retention;
- bypassing Electron's one-debugger-per-target rule;
- claiming that profiling itself fixes a renderer performance defect.
