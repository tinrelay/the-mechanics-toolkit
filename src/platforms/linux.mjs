import fs from "node:fs";
import path from "node:path";
import {spawn, spawnSync} from "node:child_process";
import {
  installLinuxDeb,
  prepareLinuxCandidateAdoption
} from "../linux-deb.mjs";

const dialogTitle = "The Mechanic's Toolkit";
const taskIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function resolveApplication(argument) {
  if (typeof argument !== "string" || argument.trim() === "") {
    throw new Error("missing application path after --");
  }
  return path.resolve(argument);
}

export function applicationLayout(app) {
  return {
    executable: path.join(app, "ChatGPT"),
    cli: path.join(app, "resources/codex")
  };
}

export function defaultTerminal({environment = process.env} = {}) {
  const desktop = desktopName(environment);
  const preferred = desktop.includes("kde") || desktop.includes("plasma")
    ? ["konsole", "x-terminal-emulator", "kgx", "gnome-terminal", "xfce4-terminal", "xterm"]
    : ["kgx", "gnome-terminal", "x-terminal-emulator", "konsole", "xfce4-terminal", "xterm"];
  for (const name of preferred) {
    const executable = findExecutable(name, environment);
    if (executable != null) return executable;
  }
  throw new Error("no supported Linux terminal emulator is available");
}

export function confirmApplicationRestart({
  processRunner = spawnSync,
  environment = process.env
} = {}) {
  return confirmChoice({
    message: "Codex restart is armed.\n\nWait for all active agents to reach a safe stopping point, " +
      "then click Relaunch Codex.",
    affirmative: "Relaunch Codex",
    negative: "Don't Restart",
    processRunner,
    environment
  });
}

export function confirmRepairFallback({
  processRunner = spawnSync,
  environment = process.env
} = {}) {
  return confirmChoice({
    message: "Codex could not be repaired after three attempts.\n\nRestore the last known-working " +
      "version, or open a terminal line to continue troubleshooting with the agent.",
    affirmative: "Restore Known-Working",
    negative: "Open Terminal Line with Agent",
    processRunner,
    environment
  }) ? "restore" : "interactive";
}

export function confirmTaskHandoff({
  processRunner = spawnSync,
  environment = process.env
} = {}) {
  return confirmChoice({
    message: "Codex closed, but the agent task that armed this restart is still active.\n\n" +
      "Close its existing terminal or session, then click Continue.",
    affirmative: "Continue",
    negative: "Don't Relaunch",
    processRunner,
    environment
  });
}

export function diagnosticLocations(home) {
  return {
    desktopLogs: path.join(home, ".local/state/codex/logs"),
    rendererScope: path.join(home, ".config/Codex/sentry/scope_v3.json")
  };
}

export function launchApplication({
  app,
  marker,
  appLog,
  taskId,
  processLauncher = spawn,
  environment = process.env
}) {
  const {executable} = applicationLayout(app);
  if (typeof taskId !== "string" || !taskIdPattern.test(taskId)) {
    throw new Error("Linux application launch requires a valid task ID");
  }
  const log = fs.openSync(appLog, "a", 0o600);
  let child;
  try {
    child = processLauncher(executable, [`codex://threads/${taskId}`], {
      detached: true,
      stdio: ["ignore", log, log],
      env: {...environment, CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH: marker}
    });
  } finally {
    fs.closeSync(log);
  }
  child.unref();
  return child;
}

export function releaseApplicationLaunch() {
  // Linux launches the exact Electron main process, not a lifetime proxy.
}

export function applicationIsRunning(executable, options = {}) {
  return applicationProcessIds(executable, options).length > 0;
}

export function ancestorProcessPid(executable, {
  startPid = process.ppid,
  maximumDepth = 32,
  processRoot = "/proc",
  fileSystem = fs
} = {}) {
  const expected = exactExecutable(executable, fileSystem);
  if (!Number.isInteger(startPid) || startPid <= 0) {
    throw new Error("ancestor search requires a valid starting PID");
  }
  let pid = startPid;
  const visited = new Set();
  for (let depth = 0; depth < maximumDepth && pid > 1 && !visited.has(pid); depth += 1) {
    visited.add(pid);
    const observed = processExecutable(processRoot, pid, fileSystem);
    if (observed == null) return null;
    if (observed === expected) return pid;
    pid = processParent(processRoot, pid, fileSystem);
    if (pid == null) return null;
  }
  return null;
}

export function requestApplicationQuit(executable, {
  processRoot = "/proc",
  fileSystem = fs,
  processKiller = process.kill
} = {}) {
  const pids = applicationProcessIds(executable, {processRoot, fileSystem});
  for (const pid of pids) {
    try {
      processKiller(pid, "SIGTERM");
    } catch (error) {
      if (error?.code !== "ESRCH") throw error;
    }
  }
  return true;
}

export function openRescueTerminal({
  terminalApp,
  commandFile,
  processLauncher = spawn
}) {
  const executable = findExecutable(terminalApp, process.env);
  if (executable == null) {
    return {opened: false, error: `Linux rescue terminal is not executable: ${terminalApp}`,
      applicationOwned: false};
  }
  const arguments_ = terminalArguments(executable, commandFile);
  let child;
  try {
    child = processLauncher(executable, arguments_, {detached: true, stdio: "ignore"});
  } catch (error) {
    return {opened: false, error: error.message.slice(0, 1000), applicationOwned: false};
  }
  child.once("error", () => {});
  child.unref();
  return {opened: true, error: null, applicationOwned: false, terminalPid: child.pid ?? null};
}

export function rescueStopHookOverride({nodeExecutable, hookScript, receiptFile, taskId, codexHome}) {
  const command = [nodeExecutable, hookScript, receiptFile, taskId, codexHome]
    .map(shellQuote).join(" ");
  return `hooks.Stop=[{hooks=[{type="command",command=${JSON.stringify(command)},` +
    `timeout=30,statusMessage="Finishing rescue turn"}]}]`;
}

export function rescueTerminalClosureRequired() {
  return false;
}

export function closeOwnedRescueTerminal() {
  return {scheduled: false, reason: "self-closing"};
}

export function prepareCandidateAdoption({
  candidatePath,
  candidateSourcePath,
  knownGoodPath,
  configuration,
  incidentDirectory,
  appInspector
}) {
  return prepareLinuxCandidateAdoption({
    candidatePath,
    candidateSourcePath,
    knownGoodPath,
    targetApp: configuration.app,
    incidentDirectory,
    appInspector
  });
}

export function replaceApplicationWithVerifiedSource({
  targetApp,
  source,
  processRunner = spawnSync,
  appInspector,
  sourceInspector,
  effectiveUserId = process.getuid?.() ?? -1,
  environment = process.env
}) {
  if (effectiveUserId === 0) {
    return installLinuxDeb({
      targetApp,
      source,
      processRunner,
      appInspector,
      sourceInspector,
      effectiveUserId,
      environment
    });
  }
  const helper = createAskpassHelper({source, environment});
  try {
    return installLinuxDeb({
      targetApp,
      source,
      processRunner,
      appInspector,
      sourceInspector,
      effectiveUserId,
      environment: {...environment, SUDO_ASKPASS: helper}
    });
  } finally {
    fs.rmSync(helper, {force: true});
  }
}

function createAskpassHelper({source, environment}) {
  const backend = dialogBackend(environment);
  const message = "Enter your password to authorize sudo dpkg -i candidate.deb.";
  let arguments_;
  if (backend.name === "kdialog") {
    arguments_ = ["--title", dialogTitle, "--password", message];
  } else if (backend.name === "yad") {
    arguments_ = [
      "--entry",
      "--hide-text",
      `--title=${dialogTitle}`,
      `--text=${message}`,
      "--button=gtk-cancel:1",
      "--button=gtk-ok:0"
    ];
  } else {
    arguments_ = ["--password", `--title=${dialogTitle} — sudo dpkg -i candidate.deb`];
  }
  const directory = path.dirname(path.resolve(source.deb));
  const helper = path.join(directory, `.tmtk-sudo-askpass-${process.pid}`);
  const command = [backend.command, ...arguments_].map(shellQuote).join(" ");
  fs.writeFileSync(helper, `#!/bin/sh\nexec ${command} 2>/dev/null\n`, {
    encoding: "utf8",
    mode: 0o700,
    flag: "wx"
  });
  fs.chmodSync(helper, 0o700);
  return helper;
}

function confirmChoice({message, affirmative, negative, processRunner, environment}) {
  const backend = dialogBackend(environment);
  const result = processRunner(backend.command, backend.arguments({
    title: dialogTitle,
    message,
    affirmative,
    negative
  }), {encoding: "utf8", env: environment});
  if (result.error != null) throw result.error;
  if (result.status === 0) return true;
  if (backend.cancelStatuses.includes(result.status)) return false;
  throw new Error((result.stderr || result.stdout).trim() ||
    `Linux restart confirmation failed through ${path.basename(backend.command)}`);
}

function dialogBackend(environment) {
  const desktop = desktopName(environment);
  const preferred = desktop.includes("kde") || desktop.includes("plasma")
    ? ["kdialog", "zenity", "yad"]
    : ["zenity", "yad", "kdialog"];
  for (const name of preferred) {
    const command = findExecutable(name, environment);
    if (command == null) continue;
    if (name === "kdialog") {
      return {
        name,
        command,
        cancelStatuses: [1],
        arguments: ({title, message, affirmative, negative}) => [
          "--title", title,
          "--yesno", message,
          "--yes-label", affirmative,
          "--no-label", negative
        ]
      };
    }
    return {
      name,
      command,
      cancelStatuses: name === "yad" ? [1, 252] : [1],
      arguments: ({title, message, affirmative, negative}) => [
        "--question",
        `--title=${title}`,
        `--text=${message}`,
        `--ok-label=${affirmative}`,
        `--cancel-label=${negative}`,
        "--width=520"
      ]
    };
  }
  throw new Error("no supported Linux dialog program is available (tried zenity, yad, kdialog)");
}

function desktopName(environment) {
  return `${environment.XDG_CURRENT_DESKTOP ?? ""}:${environment.DESKTOP_SESSION ?? ""}`.toLowerCase();
}

function findExecutable(name, environment) {
  if (name.includes(path.sep)) return executableFile(path.resolve(name)) ? path.resolve(name) : null;
  for (const directory of String(environment.PATH ?? "").split(path.delimiter).filter(Boolean)) {
    const candidate = path.join(directory, name);
    if (executableFile(candidate)) return candidate;
  }
  return null;
}

function executableFile(file) {
  try {
    fs.accessSync(file, fs.constants.X_OK);
    return fs.statSync(file).isFile();
  } catch {
    return false;
  }
}

function applicationProcessIds(executable, {
  processRoot = "/proc",
  fileSystem = fs
} = {}) {
  const expected = exactExecutable(executable, fileSystem);
  let entries;
  try {
    entries = fileSystem.readdirSync(processRoot, {withFileTypes: true});
  } catch (error) {
    throw new Error(`could not inspect Linux processes: ${error.message}`);
  }
  return entries
    .filter(entry => entry.isDirectory() && /^\d+$/.test(entry.name))
    .map(entry => Number(entry.name))
    .filter(pid => processExecutable(processRoot, pid, fileSystem) === expected &&
      electronMainProcess(processRoot, pid, fileSystem))
    .sort((left, right) => left - right);
}

function electronMainProcess(processRoot, pid, fileSystem) {
  let commandLine;
  try {
    commandLine = fileSystem.readFileSync(path.join(processRoot, String(pid), "cmdline"));
  } catch (error) {
    if (new Set(["ENOENT", "EACCES", "EPERM"]).has(error?.code)) return false;
    throw error;
  }
  const arguments_ = commandLine.toString("utf8").split("\0").filter(Boolean).slice(1);
  return !arguments_.some(argument => argument.startsWith("--type="));
}

function exactExecutable(executable, fileSystem) {
  if (typeof executable !== "string" || executable.trim() === "") {
    throw new Error("application executable is required");
  }
  try {
    return fileSystem.realpathSync(executable);
  } catch (error) {
    throw new Error(`could not resolve Linux application executable ${executable}: ${error.message}`);
  }
}

function processExecutable(processRoot, pid, fileSystem) {
  try {
    const target = fileSystem.readlinkSync(path.join(processRoot, String(pid), "exe"));
    return target.endsWith(" (deleted)") ? null : target;
  } catch (error) {
    if (new Set(["ENOENT", "EACCES", "EPERM"]).has(error?.code)) return null;
    throw error;
  }
}

function processParent(processRoot, pid, fileSystem) {
  let status;
  try {
    status = fileSystem.readFileSync(path.join(processRoot, String(pid), "status"), "utf8");
  } catch (error) {
    if (new Set(["ENOENT", "EACCES", "EPERM"]).has(error?.code)) return null;
    throw error;
  }
  const match = status.match(/^PPid:\s+(\d+)$/m);
  if (match == null) throw new Error(`Linux returned an invalid process identity for PID ${pid}`);
  return Number(match[1]);
}

function terminalArguments(terminalApp, commandFile) {
  if (typeof terminalApp !== "string" || terminalApp.trim() === "") {
    throw new Error("Linux rescue terminal is required");
  }
  const name = path.basename(terminalApp);
  if (name === "gnome-terminal" || name === "kgx") return ["--wait", "--", commandFile];
  if (name === "konsole") return ["--nofork", "-e", commandFile];
  if (name === "xfce4-terminal") return ["--disable-server", "--execute", commandFile];
  if (name === "x-terminal-emulator" || name === "xterm") return ["-e", commandFile];
  throw new Error(`unsupported Linux rescue terminal: ${terminalApp}`);
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", `'"'"'`)}'`;
}
