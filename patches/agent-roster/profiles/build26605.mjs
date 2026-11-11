import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {runtimeOwner26605} from "../../runtime-json-reload/profiles/build26605.mjs";

export function rosterOwner26605(root) {
  return {file: path.join(root, "webview/assets/async/92243.7ae2a0b971.js"), id: "oWtO", parameters: ["e", "t", "n"]};
}

export function rosterClient26605(root) {
  return {file: path.join(root, "webview/assets/async/739301.37a39f26d6.js"), id: "Dgwo", parameters: ["e", "t", "n"]};
}

export function runBuild26605({root, command, rosterHelper}) {
  const owner = rosterOwner26605(root), factory = readRendererModule(rosterClient26605(root));
  for (const contract of ['n.d(t,{},{V:function(e,t){', 'p=e.get(d);', 'return p.forHost(t)', 'if(null!=h)return h.rpc;', '},p:d})']) unique(factory, contract);
  let source = readRendererModule(owner);
  for (const contract of ['ix=n("Dgwo")', 'lL=n("s6B0")', 'E=n("zTeN")', 'u=n("zd8w")', 'T=n("OWtl")', '(0,i.jsx)(mD,{})']) unique(source, contract);
  const before = 'function mD(){let e,t,n,a,i=(0,c.c)(11),s=(0,E.gh)(T.u),';
  const after = before.replace('{let ', '{MTKuseAgentRoster();let ');
  const helper = 'const MTKrosterRpc=ix.V;' + rosterHelper({scope: '(0,E.gh)(T.u)', react: 'u', projectsAtom: 'lL.VU', client: 'MTKrosterRpc', readinessStatement: ''});
  const normalized = source.replaceAll('MTKuseAgentRoster();', '').replaceAll('MTKusePaletteBootstrap();', '').replaceAll('MTKuseAttentionBootstrap26605();', '');
  unique(normalized, before);
  const applied = source.includes(helper) && source.includes('MTKuseAgentRoster();');
  if (!applied) {
    if (source.includes('MTKagentRosterRelativePath') || source.includes('MTKuseAgentRoster')) throw new Error('Upstream changed: partial roster module patch');
    unique(source, before);
    if (command === 'apply') {
      if (!readRendererModule(runtimeOwner26605(root)).includes('globalThis.__MTK_RUNTIME_JSON_RELOAD__=Object.freeze(')) throw new Error('agent-roster requires runtime-json-reload first');
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
