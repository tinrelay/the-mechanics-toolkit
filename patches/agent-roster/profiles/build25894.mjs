import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {runtimeOwner25894} from "../../runtime-json-reload/profiles/build25894.mjs";

export function rosterOwner25894(root) {
  return {file: path.join(root, "webview/assets/async/366057.08ca21677c.js"), id: "bREQ", parameters: ["e", "t", "n"]};
}

export function rosterClient25894(root) {
  return {file: path.join(root, "webview/assets/async/182735.7f13786b92.js"), id: "Dgwo", parameters: ["e", "t", "n"]};
}

export function runBuild25894({root, command, rosterHelper}) {
  const owner = rosterOwner25894(root), factory = readRendererModule(rosterClient25894(root));
  for (const contract of ['n.d(t,{},{V:function(e,t){', 'p=e.get(d);', 'return p.forHost(t)', 'if(null!=h)return h.rpc;', '},p:d})']) unique(factory, contract);
  let source = readRendererModule(owner);
  for (const contract of ['ih=n("Dgwo")', 'l5=n("s6B0")', 'E=n("zTeN")', 'u=n("zd8w")', 'j=n("OWtl")', '(0,i.jsx)(mG,{})']) unique(source, contract);
  const before = 'function mG(){let e,t,n,a,i=(0,c.c)(12),s=(0,E.gh)(j.u),';
  const after = before.replace('{let ', '{MTKuseAgentRoster();let ');
  const helper = 'const MTKrosterRpc=ih.V;' + rosterHelper({scope: '(0,E.gh)(j.u)', react: 'u', projectsAtom: 'l5.VU', client: 'MTKrosterRpc', readinessStatement: ''});
  const normalized = source.replaceAll('MTKuseAgentRoster();', '').replaceAll('MTKusePaletteBootstrap();', '').replaceAll('MTKuseAttentionBootstrap25894();', '');
  unique(normalized, before);
  const applied = source.includes(helper) && source.includes('MTKuseAgentRoster();');
  if (!applied) {
    if (source.includes('MTKagentRosterRelativePath') || source.includes('MTKuseAgentRoster')) throw new Error('Upstream changed: partial roster module patch');
    unique(source, before);
    if (command === 'apply') {
      if (!readRendererModule(runtimeOwner25894(root)).includes('globalThis.__MTK_RUNTIME_JSON_RELOAD__=Object.freeze(')) throw new Error('agent-roster requires runtime-json-reload first');
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
