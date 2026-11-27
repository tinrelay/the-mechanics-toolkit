import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {runtimeOwner30866} from "../../runtime-json-reload/profiles/build30866.mjs";

export function rosterOwner30866(root) {
  return {file: path.join(root, "webview/assets/async/886197.c743fd93b0.js"), id: "yrkS", parameters: ["e", "t", "n"]};
}

export function rosterClient30866(root) {
  return {file: path.join(root, "webview/assets/async/49792.d8d33ace73.js"), id: "Dgwo", parameters: ["e", "t", "n"]};
}

export function runBuild30866({root, command, rosterHelper}) {
  const owner = rosterOwner30866(root), factory = readRendererModule(rosterClient30866(root));
  for (const contract of ['n.d(t,{},{V:function(e,t){', 'p=e.get(d);', 'return p.forHost(t)', 'if(null!=h)return h.rpc;', '},p:d})']) unique(factory, contract);
  let source = readRendererModule(owner);
  for (const contract of ["rP=n(\"Dgwo\")", "o$=n(\"s6B0\")", "C=n(\"Q840\")", 'h=n("zd8w")', 'k=n("OWtl")', '(0,s.jsx)(mA,{})']) unique(source, contract);
  const before = 'function mA(){let e,t,n,a,r=(0,d.c)(11),s=(0,C.gh)(k.u),';
  const after = before.replace('{let ', '{MTKuseAgentRoster();let ');
  const helper = 'const MTKrosterRpc=rP.V;' + rosterHelper({scope: '(0,C.gh)(k.u)', react: 'h', projectsAtom: 'o$.VU', client: 'MTKrosterRpc', readinessStatement: ''});
  const normalized = source.replaceAll('MTKuseAgentRoster();', '').replaceAll('MTKusePaletteBootstrap();', '').replaceAll('MTKuseAttentionBootstrap30866();', '');
  unique(normalized, before);
  const applied = source.includes(helper) && source.includes('MTKuseAgentRoster();');
  if (!applied) {
    if (source.includes('MTKagentRosterRelativePath') || source.includes('MTKuseAgentRoster')) throw new Error('Upstream changed: partial roster module patch');
    unique(source, before);
    if (command === 'apply') {
      if (!readRendererModule(runtimeOwner30866(root)).includes('globalThis.__MTK_RUNTIME_JSON_RELOAD__=Object.freeze(')) throw new Error('agent-roster requires runtime-json-reload first');
      source = source.replace(before, () => helper + after);
      if (!source.includes(helper + after)) throw new Error("Roster helper bytes did not survive insertion");
      writeRendererModule(owner, source);
    }
  }
  return {state: applied || command === 'apply' ? 'applied' : 'needs-apply', roster: '.codex/agent-roster.json', targets: [path.relative(root, owner.file)]};
}

function unique(source, contract) {
  if (source.split(contract).length !== 2) throw new Error(`Upstream changed: roster module contract is not unique: ${contract}`);
}
