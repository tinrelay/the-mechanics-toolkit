import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {runtimeOwner24614} from "../../runtime-json-reload/profiles/build24614.mjs";

export function rosterOwner24614(root) {
  return {file: path.join(root, "webview/assets/async/855047.832683be0d.js"), id: "MeKU", parameters: ["e", "t", "n"]};
}

export function rosterClient24614(root) {
  return {file: path.join(root, "webview/assets/async/24191.589dcc9878.js"), id: "Dgwo", parameters: ["e", "t", "n"]};
}

export function runBuild24614({root, command, rosterHelper}) {
  const owner = rosterOwner24614(root), factory = readRendererModule(rosterClient24614(root));
  for (const contract of ['function p(e,t){', 'p=e.get(d);', 'return p.forHost(t)', 'if(null!=h)return h.rpc;', 'n.d(t,{V:()=>p},{p:d})']) unique(factory, contract);
  let source = readRendererModule(owner);
  for (const contract of ['iu=n("Dgwo")', 'lz=n("s6B0")', 'E=n("y5DF")', 'u=n("zd8w")', 'P=n("OWtl")', '(0,i.jsx)(mD,{})']) unique(source, contract);
  const before = 'function mD(){let e,t,n,a,i=(0,c.c)(12),r=(0,E.gh)(P.u),';
  const after = before.replace('{let ', '{MTKuseAgentRoster();let ');
  const helper = 'const MTKrosterRpc=iu.V;' + rosterHelper({scope: '(0,E.gh)(P.u)', react: 'u', projectsAtom: 'lz.VU', client: 'MTKrosterRpc', readinessStatement: ''});
  const normalized = source.replaceAll('MTKuseAgentRoster();', '').replaceAll('MTKusePaletteBootstrap();', '').replaceAll('MTKuseAttentionBootstrap24614();', '');
  unique(normalized, before);
  const applied = source.includes(helper) && source.includes('MTKuseAgentRoster();');
  if (!applied) {
    if (source.includes('MTKagentRosterRelativePath') || source.includes('MTKuseAgentRoster')) throw new Error('Upstream changed: partial roster module patch');
    unique(source, before);
    if (command === 'apply') {
      if (!readRendererModule(runtimeOwner24614(root)).includes('globalThis.__MTK_RUNTIME_JSON_RELOAD__=Object.freeze(')) throw new Error('agent-roster requires runtime-json-reload first');
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
