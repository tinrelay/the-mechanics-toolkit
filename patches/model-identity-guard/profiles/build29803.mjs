import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {rosterOwner29803} from "../../agent-roster/profiles/build29803.mjs";

export const build29803 = {
  ownerFunction: "M:function(e){let",
  selectionOwner: "tl=nX?te?.model??nR:nH,tn=nY?n9?.filter(eV):n9;",
  loadingOwner: "e4=nJ?.isLoading===!0||!(0,ei.SO)(n4)||nz.isLoading||\"pending\"===tT",
  loadingGateOwner: "let tR=e4,tU=tR&&!nJ?.isAeon&&!nX,",
  publicationBefore: "tz=(0,eE.MD)(nz.reasoningEffort,tK),t$=",
  publicationAfter: 'tz=(0,eE.MD)(nz.reasoningEffort,tK),MTKmodelIdentityGuardHook=MTKuseModelIdentityGuard(tR?null:l6,tl,tz),t$=',
  appliedPublication: 'MTKmodelIdentityGuardHook=MTKuseModelIdentityGuard(tR?null:l6,tl,tz)',
  reactAlias: "p"
};

export function modelOwner29803(root) {
  return {file: path.join(root, "webview/assets/async/79584.107a308b22.js"), id: "cyhU", parameters: ["e", "l", "n"]};
}

export function runBuild29803({root, command, modelGuardHelper}) {
  const owner = modelOwner29803(root);
  let source = readRendererModule(owner);
  for (const contract of [build29803.ownerFunction, build29803.selectionOwner, build29803.loadingOwner, build29803.loadingGateOwner, 'p=n("zd8w")', "l7=(0,o.c)(433)"]) unique(source, contract);
  const helper = modelGuardHelper(true).replace("S7.useEffect", "p.useEffect");
  const applied = source.includes(helper) && source.includes(build29803.appliedPublication);
  if (!applied) {
    if (source.includes('MTKuseModelIdentityGuard')) throw new Error('Upstream changed: partial model guard module patch');
    unique(source, build29803.publicationBefore);
    if (command === 'apply') {
      if (!readRendererModule(rosterOwner29803(root)).includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze(')) throw new Error('Model guard requires agent-roster first');
      source = source.replace(build29803.publicationBefore, () => build29803.publicationAfter) + ";" + helper;
      if (!source.includes(helper) || !source.includes(build29803.appliedPublication)) throw new Error('Model guard insertion did not verify');
      writeRendererModule(owner, source);
    }
  }
  return {state: applied || command === 'apply' ? 'applied' : 'needs-apply', policy: '.codex/agent-roster.json', targets: [path.relative(root, owner.file)]};
}

function unique(source, contract) {
  if (source.split(contract).length !== 2) throw new Error(`Upstream changed: model guard module contract is not unique: ${contract}`);
}
