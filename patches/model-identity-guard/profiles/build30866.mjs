import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {rosterOwner30866} from "../../agent-roster/profiles/build30866.mjs";

export const build30866 = {
  ownerFunction: "M:function(e){let",
  selectionOwner: "n2=nW?n1?.model??nk:nD,n3=nq?n0?.filter(e$):n0;",
  loadingOwner: "e8=nN?.isLoading===!0||!(0,ea.SO)(nH)||nO.isLoading||\"pending\"===ty",
  loadingGateOwner: "let tI=e8,tA=tI&&!nN?.isAeon&&!nW,",
  publicationBefore: "tq=(0,e_.MD)(nO.reasoningEffort,tN),tW=",
  publicationAfter: 'tq=(0,e_.MD)(nO.reasoningEffort,tN),MTKmodelIdentityGuardHook=MTKuseModelIdentityGuard(tI?null:lX,n2,tq),tW=',
  appliedPublication: 'MTKmodelIdentityGuardHook=MTKuseModelIdentityGuard(tI?null:lX,n2,tq)',
  reactAlias: "p"
};

export function modelOwner30866(root) {
  return {file: path.join(root, "webview/assets/async/79584.e0d24f5cb0.js"), id: "cyhU", parameters: ["e", "l", "n"]};
}

export function runBuild30866({root, command, modelGuardHelper}) {
  const owner = modelOwner30866(root);
  let source = readRendererModule(owner);
  for (const contract of [build30866.ownerFunction, build30866.selectionOwner, build30866.loadingOwner, build30866.loadingGateOwner, 'p=n("zd8w")', "lZ=(0,o.c)(346)"]) unique(source, contract);
  const helper = modelGuardHelper(true).replace("S7.useEffect", "p.useEffect");
  const applied = source.includes(helper) && source.includes(build30866.appliedPublication);
  if (!applied) {
    if (source.includes('MTKuseModelIdentityGuard')) throw new Error('Upstream changed: partial model guard module patch');
    unique(source, build30866.publicationBefore);
    if (command === 'apply') {
      if (!readRendererModule(rosterOwner30866(root)).includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze(')) throw new Error('Model guard requires agent-roster first');
      source = source.replace(build30866.publicationBefore, () => build30866.publicationAfter) + ";" + helper;
      if (!source.includes(helper) || !source.includes(build30866.appliedPublication)) throw new Error('Model guard insertion did not verify');
      writeRendererModule(owner, source);
    }
  }
  return {state: applied || command === 'apply' ? 'applied' : 'needs-apply', policy: '.codex/agent-roster.json', targets: [path.relative(root, owner.file)]};
}

function unique(source, contract) {
  if (source.split(contract).length !== 2) throw new Error(`Upstream changed: model guard module contract is not unique: ${contract}`);
}
