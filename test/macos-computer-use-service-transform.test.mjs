import assert from "node:assert/strict";
import {helperState, imageHash, repairHelper} from "../patches/macos-computer-use-service/transform.mjs";

function signedImage(signatureLength) {
  const bytes = Buffer.alloc(64 + signatureLength, 0xab);
  bytes.writeUInt32LE(0xfeedfacf, 0);
  bytes.writeUInt32LE(0x100000c, 4);
  bytes.writeUInt32LE(1, 16);
  bytes.writeUInt32LE(0x1d, 32);
  bytes.writeUInt32LE(16, 36);
  bytes.writeUInt32LE(64, 40);
  bytes.writeUInt32LE(signatureLength, 44);
  return bytes;
}
const vendor = signedImage(32), local = signedImage(64);
local.fill(0x55, 64);
assert.equal(imageHash(local), imageHash(vendor), "re-signing may change signature bytes and extent only");
const changed = Buffer.from(local); changed[63] ^= 1;
assert.notEqual(imageHash(changed), imageHash(vendor), "all executable image bytes are authenticated");
assert.throws(() => helperState(local), /unknown Computer Use helper/, "unqualified helper fails closed");
assert.throws(() => repairHelper(local), /unknown Computer Use helper/);
assert.throws(() => imageHash(local.subarray(0, 63)), /signature extent/);
console.log("Computer Use helper image normalization probe passed");
