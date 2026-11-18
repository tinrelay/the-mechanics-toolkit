import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {rosterOwner28661} from "../../agent-roster/profiles/build28661.mjs";

export const build28661 = {
  ownerFunction: "M:function(e){let",
  selectionOwner: "tx=tr?tM?.model??nN:to,tw=ta?tb?.filter(eG):tb;",
  loadingOwner: "lt=tt?.isLoading===!0||!(0,er.SO)(tf)||n9.isLoading||\"pending\"===tz",
  loadingGateOwner: "let t$=lt,tY=t$&&!tt?.isAeon&&!tr,",
  publicationBefore: "t8=(0,eT.MD)(n9.reasoningEffort,t0),t7=",
  publicationAfter: 't8=(0,eT.MD)(n9.reasoningEffort,t0),MTKmodelIdentityGuardHook=MTKuseModelIdentityGuard(t$?null:nt,tx,t8),t7=',
  appliedPublication: 'MTKmodelIdentityGuardHook=MTKuseModelIdentityGuard(t$?null:nt,tx,t8)',
  reactAlias: "p"
};

export function modelOwner28661(root) {
  return {file: path.join(root, "webview/assets/async/79584.9737da4dbb.js"), id: "cyhU", parameters: ["e", "l", "n"]};
}

export function runBuild28661({root, command, modelGuardHelper}) {
  const owner = modelOwner28661(root);
  let source = readRendererModule(owner);
  for (const contract of [build28661.ownerFunction, build28661.selectionOwner, build28661.loadingOwner, build28661.loadingGateOwner, 'p=n("zd8w")', 'nl=(0,o.c)(421)']) unique(source, contract);
  const helper = modelGuardHelper(true).replace("S7.useEffect", "p.useEffect");
  const applied = source.includes(helper) && source.includes(build28661.appliedPublication);
  if (!applied) {
    if (source.includes('MTKuseModelIdentityGuard')) throw new Error('Upstream changed: partial model guard module patch');
    unique(source, build28661.publicationBefore);
    if (command === 'apply') {
      if (!readRendererModule(rosterOwner28661(root)).includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze(')) throw new Error('Model guard requires agent-roster first');
      source = source.replace(build28661.publicationBefore, () => build28661.publicationAfter) + ";" + helper;
      if (!source.includes(helper) || !source.includes(build28661.appliedPublication)) throw new Error('Model guard insertion did not verify');
      writeRendererModule(owner, source);
    }
  }
  return {state: applied || command === 'apply' ? 'applied' : 'needs-apply', policy: '.codex/agent-roster.json', targets: [path.relative(root, owner.file)]};
}

function unique(source, contract) {
  if (source.split(contract).length !== 2) throw new Error(`Upstream changed: model guard module contract is not unique: ${contract}`);
}
