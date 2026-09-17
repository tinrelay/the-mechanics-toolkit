#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  inspectLinuxRpm,
  installLinuxRpm,
  prepareLinuxRpmCandidateAdoption
} from "../src/linux-rpm.mjs";

const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-linux-rpm-test-"));
try {
  const candidateFile = fixture("candidate.rpm", "candidate");
  const sourceFile = fixture("source.rpm", "source");
  const knownGoodFile = fixture("known-good.rpm", "known-good");
  const vendorKey = fixture("RPM-GPG-KEY-chatgpt", "public key");
  const signatureCalls = [];
  const vendor = inspectLinuxRpm(sourceFile, {
    scratchParent: scratch,
    vendorKey,
    processRunner: inspectorRunner({signatureCalls}),
    packageExtractor(_source, root) {
      makeApplication(path.join(root, "usr/lib/chatgpt"));
    },
    appInspector: inspectApplication
  });
  assert.equal(vendor.packageKind, "vendor");
  assert.equal(vendor.originSignature.state, "valid");
  assert.equal(vendor.originSignature.fingerprint,
    "3bfa0e4ae8b8cc16a2d9ba684a3b4a566c4660e4");
  assert.deepEqual(signatureCalls.map(call => path.basename(call.command)), ["rpmkeys", "gpg"]);
  assert.throws(() => inspectLinuxRpm(sourceFile, {
    scratchParent: scratch,
    vendorKey,
    processRunner: inspectorRunner({signatureStatus: 1}),
    packageExtractor(_source, root) {
      makeApplication(path.join(root, "usr/lib/chatgpt"));
    },
    appInspector: inspectApplication
  }), /rpmkeys .*failed: bad signature/);

  const source = receipt({
    packageKind: "vendor",
    rpm: sourceFile,
    rpmSha256: "a".repeat(64),
    release: "1",
    packageVersion: "26.911.61220-1",
    originSignature: {state: "valid", fingerprint: "3".repeat(40)}
  });
  const candidate = receipt({
    packageKind: "tmtk",
    rpm: candidateFile,
    rpmSha256: "b".repeat(64),
    release: "1.tmtk1",
    packageVersion: "26.911.61220-1.tmtk1",
    originSignature: {state: "absent-local-rebuild"},
    receipt: {
      source: {
        version: source.version,
        release: source.release,
        architecture: source.architecture,
        sha256: source.rpmSha256
      }
    }
  });
  const knownGood = receipt({
    packageKind: "tmtk",
    rpm: knownGoodFile,
    rpmSha256: "c".repeat(64),
    version: "26.910.60000",
    build: "9600",
    release: "1.tmtk1",
    packageVersion: "26.910.60000-1.tmtk1",
    archiveSha256: "d".repeat(64),
    originSignature: {state: "absent-local-rebuild"},
    receipt: {schemaVersion: 1}
  });
  const inspectionOptions = [];
  const byContent = (file, options) => {
    inspectionOptions.push(options);
    const content = fs.readFileSync(file, "utf8");
    const value = content === "candidate" ? candidate : content === "source" ? source : knownGood;
    return {...value, rpm: path.resolve(file)};
  };
  const incident = path.join(scratch, "incident");
  fs.mkdirSync(incident);
  const prepared = prepareLinuxRpmCandidateAdoption({
    candidatePath: candidateFile,
    candidateSourcePath: sourceFile,
    knownGoodPath: knownGoodFile,
    targetApp: "/usr/lib/chatgpt",
    incidentDirectory: incident,
    rpmInspector: byContent,
    appInspector: () => applicationInspection(knownGood)
  });
  assert.equal(prepared.candidate.rpm, path.join(incident, "candidate.rpm"));
  assert.equal(prepared.knownGood.rpm, path.join(incident, "known-good.rpm"));
  assert.equal(fs.readFileSync(prepared.candidate.rpm, "utf8"), "candidate");
  assert.equal(fs.readFileSync(prepared.knownGood.rpm, "utf8"), "known-good");
  assert.equal(inspectionOptions.length, 5);
  assert.deepEqual(inspectionOptions, Array(5).fill({scratchParent: incident}));

  const mismatched = path.join(scratch, "mismatched");
  fs.mkdirSync(mismatched);
  assert.throws(() => prepareLinuxRpmCandidateAdoption({
    candidatePath: candidateFile,
    candidateSourcePath: sourceFile,
    knownGoodPath: knownGoodFile,
    targetApp: "/usr/lib/chatgpt",
    incidentDirectory: mismatched,
    rpmInspector(file) {
      const value = byContent(file);
      return path.resolve(file) === path.resolve(knownGoodFile)
        ? {...value, architecture: "x86_64"} : value;
    },
    appInspector: () => applicationInspection(knownGood)
  }), /package architecture/);
  assert.deepEqual(fs.readdirSync(mismatched), []);

  const calls = [];
  const installInspectionOptions = [];
  const installed = installLinuxRpm({
    targetApp: "/usr/lib/chatgpt",
    source: prepared.candidate,
    sourceInspector(_file, options) {
      installInspectionOptions.push(options);
      return prepared.candidate;
    },
    appInspector: () => applicationInspection(prepared.candidate),
    effectiveUserId: 1000,
    environment: {SUDO_ASKPASS: "/private/tmtk-askpass"},
    processRunner(command, arguments_, options) {
      calls.push({command, arguments_, options});
      return command === "/usr/bin/rpm" && arguments_[0] === "--query"
        ? {status: 0, stdout: `${prepared.candidate.version}\t${prepared.candidate.release}\t` +
            `${prepared.candidate.architecture}\n`, stderr: ""}
        : {status: 0, stdout: "", stderr: ""};
    }
  });
  assert.deepEqual(calls[0], {
    command: "/usr/bin/sudo",
    arguments_: ["-A", "/usr/bin/rpm", "--upgrade", "--replacepkgs", "--oldpackage",
      prepared.candidate.rpm],
    options: {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      env: {SUDO_ASKPASS: "/private/tmtk-askpass"}
    }
  });
  assert.equal(installed.packageVersion, prepared.candidate.packageVersion);
  assert.deepEqual(installInspectionOptions, [{scratchParent: incident}]);
  assert.throws(() => installLinuxRpm({
    targetApp: "/usr/lib/chatgpt",
    source: prepared.candidate,
    sourceInspector: () => prepared.candidate,
    appInspector: () => applicationInspection(prepared.candidate),
    effectiveUserId: 1000,
    environment: {},
    processRunner() {
      throw new Error("must not run without askpass");
    }
  }), /SUDO_ASKPASS/);

  process.stdout.write("Linux RPM adoption behavior probe passed\n");
} finally {
  fs.rmSync(scratch, {recursive: true, force: true});
}

function fixture(name, contents) {
  const file = path.join(scratch, name);
  fs.writeFileSync(file, contents);
  return file;
}

function receipt(overrides = {}) {
  return {
    kind: "rpm",
    packageKind: "vendor",
    rpm: "/fixture.rpm",
    rpmSha256: "0".repeat(64),
    package: "chatgpt",
    version: "26.911.61220",
    release: "1",
    packageVersion: "26.911.61220-1",
    architecture: "aarch64",
    build: "9647",
    archiveSha256: "1".repeat(64),
    executableSha256: "2".repeat(64),
    cliSha256: "3".repeat(64),
    originSignature: {state: "valid", fingerprint: "3".repeat(40)},
    receipt: null,
    ...overrides
  };
}

function makeApplication(app) {
  fs.mkdirSync(path.join(app, "resources"), {recursive: true});
}

function inspectApplication(app) {
  return {
    app,
    version: "26.911.61220",
    build: "9647",
    archive: {sha256: "1".repeat(64)},
    executable: {sha256: "2".repeat(64)},
    cli: {sha256: "3".repeat(64)}
  };
}

function applicationInspection(source) {
  return {
    version: source.version,
    build: source.build,
    archive: {sha256: source.archiveSha256},
    executable: {sha256: source.executableSha256},
    cli: {sha256: source.cliSha256}
  };
}

function inspectorRunner({signatureCalls = [], signatureStatus = 0} = {}) {
  return (command, arguments_) => {
    if (command === "/usr/bin/rpm" && arguments_[0] === "--querytags") {
      return {status: 0, stdout: "", stderr: ""};
    }
    if (command === "/usr/bin/rpm" && arguments_[0] === "--query") {
      return {
        status: 0,
        stdout: "chatgpt\n26.911.61220\n1\naarch64\nRSA/SHA512, Key ID 4a3b4a566c4660e4\n",
        stderr: ""
      };
    }
    if (command === "/usr/bin/rpmkeys") {
      signatureCalls.push({command, arguments_});
      return signatureStatus === 0 ? {
        status: 0,
        stdout: "Header OpenPGP V4 RSA/SHA512 signature, key fingerprint: " +
          "3bfa0e4ae8b8cc16a2d9ba684a3b4a566c4660e4: OK\n",
        stderr: ""
      } : {status: signatureStatus, stdout: "", stderr: "bad signature"};
    }
    if (command === "/usr/bin/gpg") {
      signatureCalls.push({command, arguments_});
      return {
        status: 0,
        stdout: "pub:-:4096:1:4A3B4A566C4660E4::::::\nfpr:::::::::" +
          "3BFA0E4AE8B8CC16A2D9BA684A3B4A566C4660E4:\n",
        stderr: ""
      };
    }
    throw new Error(`unexpected fixture command: ${command} ${arguments_.join(" ")}`);
  };
}
