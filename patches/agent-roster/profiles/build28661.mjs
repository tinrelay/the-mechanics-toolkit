import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {runtimeOwner28661} from "../../runtime-json-reload/profiles/build28661.mjs";

export function rosterOwner28661(root) {
  return {file: path.join(root, "webview/assets/async/195836.c6296fd869.js"), id: "LxTx", parameters: ["e", "t", "n"]};
}

export function rosterClient28661(root) {
  return {file: path.join(root, "webview/assets/async/907538.91f2a19777.js"), id: "Dgwo", parameters: ["e", "t", "n"]};
}

export function runBuild28661({root, command, rosterHelper}) {
  const owner = rosterOwner28661(root), factory = readRendererModule(rosterClient28661(root));
  for (const contract of ['n.d(t,{},{V:function(e,t){', 'p=e.get(d);', 'return p.forHost(t)', 'if(null!=h)return h.rpc;', '},p:d})']) unique(factory, contract);
  let source = readRendererModule(owner);
  for (const contract of ['iC=n("Dgwo")', 'lA=n("s6B0")', 'E=n("zTeN")', 'u=n("zd8w")', 'T=n("OWtl")', '(0,i.jsx)(mV,{})']) unique(source, contract);
  const before = 'function mV(){let e,t,n,a,i=(0,c.c)(11),s=(0,E.gh)(T.u),';
  const after = before.replace('{let ', '{MTKuseAgentRoster();let ');
  const helper = 'const MTKrosterRpc=iC.V;' + rosterHelper({scope: '(0,E.gh)(T.u)', react: 'u', projectsAtom: 'lA.VU', client: 'MTKrosterRpc', readinessStatement: ''});
  const normalized = source.replaceAll('MTKuseAgentRoster();', '').replaceAll('MTKusePaletteBootstrap();', '').replaceAll('MTKuseAttentionBootstrap28661();', '');
  unique(normalized, before);
  const applied = source.includes(helper) && source.includes('MTKuseAgentRoster();');
  if (!applied) {
    if (source.includes('MTKagentRosterRelativePath') || source.includes('MTKuseAgentRoster')) throw new Error('Upstream changed: partial roster module patch');
    unique(source, before);
    if (command === 'apply') {
      if (!readRendererModule(runtimeOwner28661(root)).includes('globalThis.__MTK_RUNTIME_JSON_RELOAD__=Object.freeze(')) throw new Error('agent-roster requires runtime-json-reload first');
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
