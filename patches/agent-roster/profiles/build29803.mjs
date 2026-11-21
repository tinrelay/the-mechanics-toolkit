import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {runtimeOwner29803} from "../../runtime-json-reload/profiles/build29803.mjs";

export function rosterOwner29803(root) {
  return {file: path.join(root, "webview/assets/async/191628.7c4ce6e8ec.js"), id: "mjpt", parameters: ["e", "t", "n"]};
}

export function rosterClient29803(root) {
  return {file: path.join(root, "webview/assets/async/911644.eaf037cac0.js"), id: "Dgwo", parameters: ["e", "t", "n"]};
}

export function runBuild29803({root, command, rosterHelper}) {
  const owner = rosterOwner29803(root), factory = readRendererModule(rosterClient29803(root));
  for (const contract of ['n.d(t,{},{V:function(e,t){', 'p=e.get(d);', 'return p.forHost(t)', 'if(null!=h)return h.rpc;', '},p:d})']) unique(factory, contract);
  let source = readRendererModule(owner);
  for (const contract of ["rM=n(\"Dgwo\")", "oK=n(\"s6B0\")", "A=n(\"qmMi\")", 'u=n("zd8w")', 'O=n("OWtl")', '(0,r.jsx)(fg,{})']) unique(source, contract);
  const before = 'function fg(){let e,t,n,a,r=(0,c.c)(11),s=(0,A.gh)(O.u),';
  const after = before.replace('{let ', '{MTKuseAgentRoster();let ');
  const helper = 'const MTKrosterRpc=rM.V;' + rosterHelper({scope: '(0,A.gh)(O.u)', react: 'u', projectsAtom: 'oK.VU', client: 'MTKrosterRpc', readinessStatement: ''});
  const normalized = source.replaceAll('MTKuseAgentRoster();', '').replaceAll('MTKusePaletteBootstrap();', '').replaceAll('MTKuseAttentionBootstrap29803();', '');
  unique(normalized, before);
  const applied = source.includes(helper) && source.includes('MTKuseAgentRoster();');
  if (!applied) {
    if (source.includes('MTKagentRosterRelativePath') || source.includes('MTKuseAgentRoster')) throw new Error('Upstream changed: partial roster module patch');
    unique(source, before);
    if (command === 'apply') {
      if (!readRendererModule(runtimeOwner29803(root)).includes('globalThis.__MTK_RUNTIME_JSON_RELOAD__=Object.freeze(')) throw new Error('agent-roster requires runtime-json-reload first');
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
