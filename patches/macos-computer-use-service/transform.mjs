import crypto from "node:crypto";

// Re-signing replaces the signature and updates its command and __LINKEDIT extent, but no
// executable payload. Normalize those size fields when pinning the complete unsigned image.
const stockHash = "e8386f50c8ffdc8a105963054ef46f849dcabb8764d371d44ece7ed9afde2b24";
const appliedHash = "1cbe1538a7406b9eb01559c9e6e55956faca64c37aeec2ad216e398ddf51e563";
const parentGate = 0x180bdc;
const sameTeamRequirement = 0xdd6c20;
const developerTeam = 0xdd6b90;

export function helperState(bytes) {
  const hash = imageHash(bytes);
  if (hash === stockHash) return "needs-apply";
  if (hash === appliedHash) return "applied";
  throw new Error(`Upstream changed: unknown Computer Use helper image ${hash}`);
}

export function repairHelper(bytes) {
  if (helperState(bytes) === "applied") return bytes;
  const result = Buffer.from(bytes);
  // ComputerUseIPCSenderAuthorization: only remove the parent/ancestor signature gate.
  // The separate SlimCore transport requirement below still authenticates the immediate peer.
  result.writeUInt32LE(0x52800060, parentGate);     // mov w0, #3 (authorized enum)
  result.writeUInt32LE(0xd65f03c0, parentGate + 4); // ret

  // SkyIPCRequirement.isFromSameTeam cannot derive a team from a local signature. Keep its
  // original vendor-peer requirement by using isFromDeveloperTeam("2DC432GLL2") instead.
  const words = [];
  for (const [register, value] of [[0, 0x4c47323334434432n], [1, 0xea0000000000324cn]]) {
    let first = true;
    for (let half = 0; half < 4; half++) {
      const immediate = Number((value >> BigInt(half * 16)) & 0xffffn);
      if (!first && immediate === 0) continue;
      words.push(((first ? 0xd2800000 : 0xf2800000) | half << 21 | immediate << 5 | register) >>> 0);
      first = false;
    }
  }
  const branch = sameTeamRequirement + words.length * 4;
  words.push((0x14000000 | ((developerTeam - branch) / 4 & 0x3ffffff)) >>> 0);
  words.forEach((word, index) => result.writeUInt32LE(word, sameTeamRequirement + index * 4));
  if (helperState(result) !== "applied") throw new Error("Computer Use helper repair did not verify");
  return result;
}

export function imageHash(bytes) {
  if (bytes.length < 32 || bytes.readUInt32LE(0) !== 0xfeedfacf || bytes.readUInt32LE(4) !== 0x100000c) {
    throw new Error("Expected an ARM64 Mach-O Computer Use helper");
  }
  const count = bytes.readUInt32LE(16);
  let offset = 32, signature, linkedit;
  for (let index = 0; index < count; index++) {
    if (offset + 8 > bytes.length) throw new Error("Truncated Mach-O load command");
    const command = bytes.readUInt32LE(offset), size = bytes.readUInt32LE(offset + 4);
    if (size < 8 || offset + size > bytes.length) throw new Error("Invalid Mach-O load command");
    if (command === 0x1d) {
      if (signature || size !== 16) throw new Error("Unexpected Mach-O signature command");
      signature = {command: offset, start: bytes.readUInt32LE(offset + 8), size: bytes.readUInt32LE(offset + 12)};
    }
    if (command === 0x19 && size >= 72 && bytes.subarray(offset + 8, offset + 24).toString().replace(/\0.*$/, "") === "__LINKEDIT") {
      if (linkedit) throw new Error("Duplicate __LINKEDIT segment");
      linkedit = offset;
      const start = bytes.readBigUInt64LE(offset + 40), length = bytes.readBigUInt64LE(offset + 48);
      if (start + length !== BigInt(bytes.length) || bytes.readBigUInt64LE(offset + 32) !== (length + 0x3fffn & ~0x3fffn)) {
        throw new Error("Unexpected __LINKEDIT signature extent");
      }
    }
    offset += size;
  }
  if (!signature || signature.start < offset || signature.start + signature.size !== bytes.length) {
    throw new Error("Unexpected Mach-O signature extent");
  }
  const image = Buffer.from(bytes.subarray(0, signature.start));
  image.fill(0, signature.command + 8, signature.command + 16);
  if (linkedit !== undefined) {
    image.fill(0, linkedit + 32, linkedit + 40);
    image.fill(0, linkedit + 48, linkedit + 56);
  }
  return crypto.createHash("sha256").update(image).digest("hex");
}
