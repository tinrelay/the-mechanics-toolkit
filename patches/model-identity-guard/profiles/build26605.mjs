import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {rosterOwner26605} from "../../agent-roster/profiles/build26605.mjs";

export const build26605 = {
  ownerFunction: "M:function(e){let",
  selectionOwner: "n9=nQ?n6?.model??nS:nZ,te=nY?n7?.filter(ez):n7;",
  loadingOwner: "e6=nG?.isLoading===!0||!(0,es.SO)(n2)||nq.isLoading||\"pending\"===tw",
  loadingGateOwner: "let tT=e6,tP=tT&&!nG?.isAeon&&!nQ,",
  publicationBefore: "tF=nG?.lockedReasoningEffort??(0,eA.MD)(nq.reasoningEffort,tU),tD=",
  publicationAfter: 'tF=nG?.lockedReasoningEffort??(0,eA.MD)(nq.reasoningEffort,tU),MTKmodelIdentityGuardHook=MTKuseModelIdentityGuard(tT?null:l0,n9,tF),tD=',
  appliedPublication: 'MTKmodelIdentityGuardHook=MTKuseModelIdentityGuard(tT?null:l0,n9,tF)',
  reactAlias: "g"
};

export function modelOwner26605(root) {
  return {file: path.join(root, "webview/assets/async/549505.de50db1d13.js"), id: "cyhU", parameters: ["e", "l", "n"]};
}

export function runBuild26605({root, command, modelGuardHelper}) {
  const owner = modelOwner26605(root);
  let source = readRendererModule(owner);
  for (const contract of [build26605.ownerFunction, build26605.selectionOwner, build26605.loadingOwner, build26605.loadingGateOwner, 'g=n("zd8w")', 'lH=(0,o.c)(387)']) unique(source, contract);
  const helper = modelGuardHelper(true).replace("S7.useEffect", "g.useEffect");
  const applied = source.includes(helper) && source.includes(build26605.appliedPublication);
  if (!applied) {
    if (source.includes('MTKuseModelIdentityGuard')) throw new Error('Upstream changed: partial model guard module patch');
    unique(source, build26605.publicationBefore);
    if (command === 'apply') {
      if (!readRendererModule(rosterOwner26605(root)).includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze(')) throw new Error('Model guard requires agent-roster first');
      source = source.replace(build26605.publicationBefore, () => build26605.publicationAfter) + ";" + helper;
      if (!source.includes(helper) || !source.includes(build26605.appliedPublication)) throw new Error('Model guard insertion did not verify');
      writeRendererModule(owner, source);
    }
  }
  return {state: applied || command === 'apply' ? 'applied' : 'needs-apply', policy: '.codex/agent-roster.json', targets: [path.relative(root, owner.file)]};
}

function unique(source, contract) {
  if (source.split(contract).length !== 2) throw new Error(`Upstream changed: model guard module contract is not unique: ${contract}`);
}
