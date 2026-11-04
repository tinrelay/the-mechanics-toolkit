import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {rosterOwner24614} from "../../agent-roster/profiles/build24614.mjs";

export const build24614 = {
  ownerFunction: "function eP(e){",
  selectionOwner: 'nH=nN?nZ?.model??nu:nj,nX=nD?n$?.filter(eF):n$;',
  loadingOwner: 'e2=n_?.isLoading===!0||!(0,et.SO)(nV)||nI.isLoading||"pending"===os',
  loadingGateOwner: 'let ov=e2,ob=ov&&!n_?.isAeon&&!nN,',
  publicationBefore: 'oR=n_?.lockedReasoningEffort??(0,eE.MD)(nI.reasoningEffort,ow),oA=',
  publicationAfter: 'oR=n_?.lockedReasoningEffort??(0,eE.MD)(nI.reasoningEffort,ow),MTKmodelIdentityGuardHook=MTKuseModelIdentityGuard(ov?null:lz,nH,oR),oA=',
  appliedPublication: 'MTKmodelIdentityGuardHook=MTKuseModelIdentityGuard(ov?null:lz,nH,oR)',
  reactAlias: "g"
};

export function modelOwner24614(root) {
  return {file: path.join(root, "webview/assets/async/104066.68b4099784.js"), id: "cyhU", parameters: ["e", "l", "n"]};
}

export function runBuild24614({root, command, modelGuardHelper}) {
  const owner = modelOwner24614(root);
  let source = readRendererModule(owner);
  for (const contract of [build24614.ownerFunction, build24614.selectionOwner, build24614.loadingOwner, build24614.loadingGateOwner, 'g=n("zd8w")', 'lV=(0,t.c)(393)']) unique(source, contract);
  const helper = modelGuardHelper(true).replace("S7.useEffect", "g.useEffect");
  const applied = source.includes(helper) && source.includes(build24614.appliedPublication);
  if (!applied) {
    if (source.includes('MTKuseModelIdentityGuard')) throw new Error('Upstream changed: partial model guard module patch');
    unique(source, build24614.publicationBefore);
    if (command === 'apply') {
      if (!readRendererModule(rosterOwner24614(root)).includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze(')) throw new Error('Model guard requires agent-roster first');
      source = source.replace(build24614.ownerFunction, () => helper + build24614.ownerFunction)
        .replace(build24614.publicationBefore, () => build24614.publicationAfter);
      if (!source.includes(helper) || !source.includes(build24614.appliedPublication)) throw new Error('Model guard insertion did not verify');
      writeRendererModule(owner, source);
    }
  }
  return {state: applied || command === 'apply' ? 'applied' : 'needs-apply', policy: '.codex/agent-roster.json', targets: [path.relative(root, owner.file)]};
}

function unique(source, contract) {
  if (source.split(contract).length !== 2) throw new Error(`Upstream changed: model guard module contract is not unique: ${contract}`);
}
