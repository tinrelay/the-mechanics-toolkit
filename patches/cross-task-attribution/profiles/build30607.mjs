import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";

export function attributionOwner30607(root) {
  return {file: path.join(root, "webview/assets/async/407859.bb57f12697.js"), id: "qGHI", parameters: ["e", "t", "n"]};
}

export const attribution30607 = {
  owner: 'function eX(e){let t,n,l,s,r=(0,i.c)(13),',
  appliedOwner: 'function eX(e){let t,n,l,s,r=(0,i.c)(14),',
  metadataBefore: "y=`/local/${c}`;return r[0]",
  metadataAfter: 'y=`/local/${c}`;let MTKtitle=(0,MTKcrossTaskState._U)(MTKtitleAtom,{hostId:f??"local",threadId:c}),MTKsourceState=(0,MTKcrossTaskState._U)(MTKsourceThreadAtom,{hostId:f??"local",threadId:c}),MTKsourceTask=(f==null||f==="local")&&MTKsourceState!=null?{kind:"local",summary:MTKsourceState.summary}:null,MTKresolvedSender=MTKsenderFromSource(MTKtitle,MTKsourceTask,c);return r[0]',
  bindings: 'const MTKtitleAtom=tc.HX,MTKsourceThreadAtom=tc.ok,MTKcrossTaskState=c;',
  accent: 'const MTKdelegatedAccentColor=`var(--color-token-interactive-bg-accent-muted-context,rgba(51,156,255,.1))`;'
};

export function runBuild30607({root, command, currentHelper, attributionLabel}) {
  const owner = attributionOwner30607(root);
  let source = readRendererModule(owner);
  for (const contract of ['c=n("Q840")', "tc=n(\"tl5a\")", "sourceThreadId:c,message:d,sentAtMs:u,cwd:h,hostId:f,", 'alignment:y,accentColor:u,message:p,', 'y=void 0===d?"end":d']) unique(source, contract);
  const fields = {file: path.join(root, "webview/assets/async/49792.ab5b643c25.js"), id: "tl5a", parameters: ["e", "t", "n"]};
  const metadata = readRendererModule(fields);
  for (const contract of ['HX:()=>te,', 'ok:()=>A.ok', 'te=(0,a.i1)(B.u,', "\"loaded\"?n.title:ts(t(Y.Ns,e))"]) unique(metadata, contract);
  const helper = currentHelper() + attribution30607.accent;
  const applied = source.includes(helper) && (source.includes(attribution30607.appliedOwner) || source.includes(attribution30607.appliedOwner.replace('(14)', '(16)')) && source.includes('r[14]!==MTKtitle||r[15]!==c') && source.includes('paletteSourceTitle:MTKtitle,paletteSourceId:c')) && source.includes(attribution30607.metadataAfter) && source.includes(attribution30607.bindings);
  if (!applied) {
    if (source.includes('MTKresolvedSender') || source.includes('function MTKsender(')) throw new Error('Upstream changed: partial attribution module patch');
    const label = attributionLabel('a', 'n', 't');
    const replacements = [
      [attribution30607.owner, helper + attribution30607.appliedOwner],
      [attribution30607.metadataBefore, attribution30607.metadataAfter],
      [',r[1]=n):n=r[1],r[2]!==v', ',r[1]=n):n=r[1],'+label.slice(0,-1)+',r[2]!==v'],
      ['r[10]!==u||r[11]!==l?(s=(0,a.jsx)(Y,', 'r[10]!==u||r[11]!==l||r[13]!==n?(s=(0,a.jsx)(Y,'],
      ['compactActions:x,onLabelClick:l}),r[5]=x', 'compactActions:x,onLabelClick:l,alignment:`end`,accentColor:MTKdelegatedAccentColor}),r[5]=x'],
      ['r[10]=u,r[11]=l,r[12]=s', 'r[10]=u,r[11]=l,r[13]=n,r[12]=s']
    ];
    for (const [before] of replacements) unique(source, before);
    if (command === 'apply') {
      for (const [before, after] of replacements) source = source.replace(before, () => after);
      source += ';'+attribution30607.bindings;
      if (!source.includes(helper) || !source.includes(attribution30607.metadataAfter)) throw new Error('Attribution helper insertion did not verify');
      writeRendererModule(owner, source);
    }
  }
  return {state: applied || command === 'apply' ? 'applied' : 'needs-apply', targets: [path.relative(root, owner.file)]};
}

function unique(source, contract) {
  if (source.split(contract).length !== 2) throw new Error(`Upstream changed: attribution module contract is not unique: ${contract}`);
}
