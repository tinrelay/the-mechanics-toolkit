import assert from 'node:assert/strict';
import {instructionFingerprint,transformInstructions} from '../patches/app-context-override/transform.mjs';

const fixture='exports.ids=[7],exports.modules={73488(e,t,r){r.d(t,{eUd:()=>r0,IzQ:()=>r1});var _=r(34338);var P=r(78335),N=r.n(P),x=r(89477),D=r(86697);let rK="desktop",r$="media",rq="automation",rz="coordination",rQ="worktrees",rJ="prose",rZ="comments";function r0({baseInstructions:r,hostedAutomationsEnabled:h,includeAutomationsSection:e}){let f=e?rq:null,_=`<app-context>\n${f.trim()}\n</app-context>`,E=rX(r??"",_);return h?(0,rV.W_)(E):E}async function r1(e){return r0(e)}},39879(e,t,r){let n="heartbeat instructions"},71530(e,t,r){let n="tool instructions"}};';
const first=transformInstructions(fixture);
assert.equal(first.state,'needs-apply');
assert.equal(transformInstructions(first.source).source,first.source,'reapply preserves bytes');
assert.equal(transformInstructions(first.source).fingerprint,instructionFingerprint(fixture),'the override does not fingerprint its own text');
assert.equal(instructionFingerprint(fixture.replace('let f=','let z=').replace('f.trim()','z.trim()')),first.fingerprint,'minifier-only renaming does not announce new instructions');
assert.notEqual(instructionFingerprint(fixture.replace('desktop','changed desktop')),first.fingerprint,'bundled instruction changes are detected');
for(const text of [fixture.replace('73488(','73489('),fixture.replace('e?rq:null','e?null:rq'),fixture.replace('return h?(0,rV.W_)(E):E','return E'),first.source.replace('app-context.md','unexpected.md')])assert.throws(()=>transformInstructions(text),/changed|contract|Partial/i,'unknown or partial ownership fails closed');
console.log('app-context transform: exact owner, reapply, instruction fingerprint and drift rejection passed');
