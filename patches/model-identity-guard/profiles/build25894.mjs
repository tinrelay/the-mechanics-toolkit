import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {rosterOwner25894} from "../../agent-roster/profiles/build25894.mjs";

export const build25894 = {
  ownerFunction: "M:function(e){let",
  selectionOwner: "nX=nD?nZ?.model??nu:nO,nH=nU?nQ?.filter(eq):nQ;",
  loadingOwner: "e3=nj?.isLoading===!0||!(0,ei.SO)(nW)||nT.isLoading||\"pending\"===os",
  loadingGateOwner: "let og=e3,op=og&&!nj?.isAeon&&!nD,",
  publicationBefore: "oS=nj?.lockedReasoningEffort??(0,eA.MD)(nT.reasoningEffort,oM),oE=",
  publicationAfter: 'oS=nj?.lockedReasoningEffort??(0,eA.MD)(nT.reasoningEffort,oM),MTKmodelIdentityGuardHook=MTKuseModelIdentityGuard(og?null:lB,nX,oS),oE=',
  appliedPublication: 'MTKmodelIdentityGuardHook=MTKuseModelIdentityGuard(og?null:lB,nX,oS)',
  reactAlias: "g"
};

export function modelOwner25894(root) {
  return {file: path.join(root, "webview/assets/async/104066.857f3d6110.js"), id: "cyhU", parameters: ["e", "l", "n"]};
}

export function runBuild25894({root, command, modelGuardHelper}) {
  const owner = modelOwner25894(root);
  let source = readRendererModule(owner);
  for (const contract of [build25894.ownerFunction, build25894.selectionOwner, build25894.loadingOwner, build25894.loadingGateOwner, 'g=n("zd8w")', 'lW=(0,t.c)(375)']) unique(source, contract);
  const helper = modelGuardHelper(true).replace("S7.useEffect", "g.useEffect");
  const applied = source.includes(helper) && source.includes(build25894.appliedPublication);
  if (!applied) {
    if (source.includes('MTKuseModelIdentityGuard')) throw new Error('Upstream changed: partial model guard module patch');
    unique(source, build25894.publicationBefore);
    if (command === 'apply') {
      if (!readRendererModule(rosterOwner25894(root)).includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze(')) throw new Error('Model guard requires agent-roster first');
      source = source.replace(build25894.publicationBefore, () => build25894.publicationAfter) + ";" + helper;
      if (!source.includes(helper) || !source.includes(build25894.appliedPublication)) throw new Error('Model guard insertion did not verify');
      writeRendererModule(owner, source);
    }
  }
  return {state: applied || command === 'apply' ? 'applied' : 'needs-apply', policy: '.codex/agent-roster.json', targets: [path.relative(root, owner.file)]};
}

function unique(source, contract) {
  if (source.split(contract).length !== 2) throw new Error(`Upstream changed: model guard module contract is not unique: ${contract}`);
}
