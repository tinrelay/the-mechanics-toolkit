import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {helperState} from "../../patches/macos-computer-use-service/transform.mjs";

const helperName = "Codex Computer Use.app";
const helperRelative = `Contents/Resources/cua_node/lib/node_modules/@oai/sky/${helperName}`;
const bundleId = "com.openai.sky.CUAService";

export function persistentComputerUseSigningIdentity(value) {
  if (typeof value !== "string" || !value.trim() || value.trim() === "-") {
    throw new Error("Computer Use requires a persistent signingIdentity certificate; ad-hoc signing would invalidate permissions on each changed build");
  }
  return value;
}

export function resetComputerUsePermissionsForSignerChange({previousRequirement, nextRequirement, processRunner = spawnSync}) {
  if (!nextRequirement?.startsWith(`identifier "${bundleId}" and `)) {
    throw new Error("Computer Use helper signing identifier changed");
  }
  if (!/\bcertificate\b/.test(nextRequirement) || /\bcdhash\b/.test(nextRequirement)) {
    throw new Error("Computer Use helper requires a stable certificate-based designated requirement");
  }
  if (previousRequirement === nextRequirement) return {state: "preserved"};
  for (const service of ["ScreenCapture", "Accessibility"]) {
    const result = processRunner("/usr/bin/tccutil", ["reset", service, bundleId], {encoding: "utf8"});
    if (result.status !== 0 || result.error) {
      throw new Error(`Could not reset stale Computer Use ${service} permission: ${result.error?.message ?? result.stderr ?? "tccutil failed"}`);
    }
  }
  return {state: "reset"};
}

export function prepareComputerUsePermissions({app, codexHome, processRunner = spawnSync}) {
  const next = path.join(app, helperRelative);
  const executable = path.join(next, "Contents/MacOS/SkyComputerUseService");
  if (!fs.existsSync(executable)) return {state: "not-selected"};
  // Ordinary/vendor helper launches remain outside this opt-in repair's policy.
  let state;
  try { state = helperState(fs.readFileSync(executable)); } catch { return {state: "not-selected"}; }
  if (state !== "applied") return {state: "not-selected"};
  if (typeof codexHome !== "string" || !codexHome.trim()) throw new Error("Computer Use launch requires the configured Codex home");
  const previous = path.join(codexHome, "computer-use", helperName);
  return resetComputerUsePermissionsForSignerChange({
    previousRequirement: fs.existsSync(previous) ? requirement(previous) : null,
    nextRequirement: requirement(next),
    processRunner
  });

  function requirement(bundle) {
    const result = processRunner("/usr/bin/codesign", ["--display", "--requirements", "-", bundle], {encoding: "utf8"});
    if (result.status !== 0 || result.error) throw new Error("Cannot inspect Computer Use helper signing requirement");
    const matches = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.match(/^designated => (.+)$/gm) ?? [];
    if (matches.length !== 1) throw new Error("Missing unique Computer Use helper designated requirement");
    return matches[0].slice("designated => ".length).trim();
  }
}
