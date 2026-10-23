import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "tmtk-dot-guard-"));
try {
  const assets = path.join(scratch, "webview/assets");
  fs.mkdirSync(assets, {recursive:true});
  const initial = path.join(assets, "app-initial-fixture.js");
  const reboot = path.join(assets, "reboot-dialog-fixture.js");
  const fixture = [
    'globalThis.__MTK_AGENT_ROSTER__=Object.freeze({current:()=>null});',
    'function jWa(e,t,n,r){let i={accountId:e.get(Mg),userId:e.get(Ng),hostId:n.hostId},d=()=>true;return f();async function f(){if(!d()||e.get(Jjn,i).has(n.threadId))return;await pMe(t,i.accountId);r?.()}}',
    'async function FHc(e,t,n=e.get(yk,t)){let r=e.query.getData(Iw,t);if(r==null)return;return yf(e,null,{orbitId:r.id,thread:{hostId:n,threadId:t}})}',
    'function IHc(e,t,n){return{id:`delete-orbit`,onSelect:()=>FHc(e,t,n)}}',
    'function KHc(e,t){if(!e.get(Fh,`970190263`))return null;let n=e.get(Mg),r=e.get(Ng);return n==null||r==null||e.get(mYe)||e.get(Tp)!==t?null:{id:`reboot-orbit`,onSelect:()=>yf(e,Xvo,{accountId:n,userId:r,threadId:t})}}'
  ].join("");
  const rebootFixture = 'function N(f,s){let m;m=async()=>{await(await O.postResponse(`/cloud-aeons/primary/reboot`,{expectedIdentity:{accountId:r,userId:a},assertRequestCurrent:()=>{if(!f.get(M,`970190263`)||f.get(A)||f.get(D)!==s)throw Error(`The selected dot cannot be rebooted`)},retry:!1})).body?.cancel()};return m}';
  fs.writeFileSync(initial, fixture);
  fs.writeFileSync(reboot, rebootFixture);
  function run(command, success=true) {
    const r=spawnSync(process.execPath,[path.join(repo,"patches/dot-lifecycle-protection/patch.mjs"),command,scratch],{encoding:"utf8"});
    if(success) {assert.equal(r.status,0,r.stderr||r.stdout);return JSON.parse(r.stdout)}
    assert.notEqual(r.status,0);return r;
  }
  assert.equal(run("check").state,"needs-apply");
  assert.equal(run("apply").state,"applied");
  const before=[fs.readFileSync(initial),fs.readFileSync(reboot)];
  const probe=spawnSync(process.execPath,[path.join(repo,"test/dot-lifecycle-protection.test.mjs"),scratch],{encoding:"utf8"});
  assert.equal(probe.status,0,probe.stderr||probe.stdout);
  assert.equal(run("apply").state,"applied");
  assert.deepEqual([fs.readFileSync(initial),fs.readFileSync(reboot)],before,"idempotent complete application");
  fs.writeFileSync(reboot,fs.readFileSync(reboot,"utf8").replace('assertRequestCurrent:()=>{globalThis.__MTK_DOT_POLICY__.assertReboot(f,s);','assertRequestCurrent:()=>{'));
  run("apply",false);
  assert.deepEqual(fs.readFileSync(initial),before[0],"partial state rejected without mutation");
  fs.writeFileSync(initial,fixture.replace('e.query.getData(Iw,t)','e.query.getData(Other,t)'));
  fs.writeFileSync(reboot,rebootFixture);
  run("apply",false);
  assert.equal(fs.readFileSync(initial,"utf8"),fixture.replace('e.query.getData(Iw,t)','e.query.getData(Other,t)'),"unknown owner fails before writes");
  console.log("dot lifecycle transform probe passed");
} finally {fs.rmSync(scratch,{recursive:true,force:true})}
