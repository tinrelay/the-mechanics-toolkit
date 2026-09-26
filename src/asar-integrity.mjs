import crypto from "node:crypto";
import fs from "node:fs";

const embeddedIntegritySentinel = Buffer.from("AGbevlPCksUGKNL8TSn7wGmJEuJsXb2A");

export function patchEmbeddedAsarIntegrity(binary, previousHash, nextHash) {
  for (const hash of [previousHash, nextHash]) {
    if (!/^[0-9a-f]{64}$/.test(hash)) throw new Error("Invalid ASAR header SHA-256");
  }
  const bytes = fs.readFileSync(binary);
  const marker = bytes.indexOf(embeddedIntegritySentinel);
  if (marker < 0) return false;
  if (bytes.indexOf(embeddedIntegritySentinel, marker + 1) >= 0) {
    throw new Error("Multiple embedded ASAR integrity slots");
  }
  const digestOffset = marker + embeddedIntegritySentinel.length + 2;
  if (digestOffset + 32 > bytes.length || bytes[digestOffset - 2] !== 1 || bytes[digestOffset - 1] !== 1) {
    throw new Error("Unknown embedded ASAR integrity slot");
  }
  const digest = hash => crypto.createHash("sha256")
    .update("Resources/app.asar").update("SHA256").update(hash).digest();
  if (!bytes.subarray(digestOffset, digestOffset + 32).equals(digest(previousHash))) {
    throw new Error("Embedded ASAR integrity digest does not match source plist");
  }
  const replacement = `${binary}.tmtk-${crypto.randomUUID()}`;
  try {
    fs.copyFileSync(binary, replacement);
    const descriptor = fs.openSync(replacement, "r+");
    try {
      if (fs.writeSync(descriptor, digest(nextHash), 0, 32, digestOffset) !== 32) {
        throw new Error("Could not update embedded ASAR integrity digest");
      }
      fs.fsyncSync(descriptor);
    } finally {
      fs.closeSync(descriptor);
    }
    fs.renameSync(replacement, binary);
  } finally {
    if (fs.existsSync(replacement)) fs.unlinkSync(replacement);
  }
  return true;
}

export function asarHeaderSha256(archive) {
  const descriptor = fs.openSync(archive, "r");
  try {
    const {header} = readHeader(descriptor, archive);
    return crypto.createHash("sha256").update(header).digest("hex");
  } finally {
    fs.closeSync(descriptor);
  }
}

export function readAsarFile(archive, relativePath) {
  if (typeof relativePath !== "string" || relativePath === "" || relativePath.startsWith("/") ||
      relativePath.split("/").some(part => part === "" || part === "." || part === "..")) {
    throw new Error(`Invalid ASAR file path: ${relativePath}`);
  }
  const descriptor = fs.openSync(archive, "r");
  try {
    const {headerPickleSize, parsed} = readHeader(descriptor, archive);
    let entry = {files: parsed.files};
    for (const part of relativePath.split("/")) entry = entry?.files?.[part];
    if (entry == null || entry.files != null || entry.unpacked === true) {
      throw new Error(`Missing packed ASAR file ${relativePath} in ${archive}`);
    }
    if (!/^\d+$/.test(String(entry.offset)) || !Number.isSafeInteger(entry.size) || entry.size < 0) {
      throw new Error(`Invalid ASAR file entry ${relativePath} in ${archive}`);
    }
    const offset = 8 + headerPickleSize + Number(entry.offset);
    return readExactly(descriptor, entry.size, offset, archive);
  } finally {
    fs.closeSync(descriptor);
  }
}

function readHeader(descriptor, archive) {
  const archiveSize = fs.fstatSync(descriptor).size;
  const prefix = readExactly(descriptor, 16, 0, archive);
  const sizePicklePayload = prefix.readUInt32LE(0);
  const headerPickleSize = prefix.readUInt32LE(4);
  const headerPicklePayload = prefix.readUInt32LE(8);
  const headerStringSize = prefix.readUInt32LE(12);

  if (sizePicklePayload !== 4) throw new Error(`Invalid ASAR size pickle in ${archive}`);
  if (headerPickleSize !== headerPicklePayload + 4 || headerPickleSize > archiveSize - 8) {
    throw new Error(`Invalid ASAR header size in ${archive}`);
  }
  if (headerStringSize > headerPicklePayload - 4) {
    throw new Error(`Invalid ASAR header string size in ${archive}`);
  }

  const header = readExactly(descriptor, headerStringSize, 16, archive);
  return {header, headerPickleSize, parsed: JSON.parse(header.toString("utf8"))};
}

function readExactly(descriptor, size, offset, archive) {
  const buffer = Buffer.alloc(size);
  if (fs.readSync(descriptor, buffer, 0, size, offset) !== size) {
    throw new Error(`Truncated ASAR header in ${archive}`);
  }
  return buffer;
}
