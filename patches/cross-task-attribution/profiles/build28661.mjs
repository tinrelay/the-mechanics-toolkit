import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";

export function attributionOwner28661(root) {
  return {file: path.join(root, "webview/assets/async/461952.e510c5b516.js"), id: "nZSc", parameters: ["e", "t", "n"]};
}

export const attribution28661 = {
  owner: 'function tt(e){let t,n,s,l,r=(0,i.c)(13),',
  appliedOwner: 'function tt(e){let t,n,s,l,r=(0,i.c)(14),',
  metadataBefore: "y=(0,e7.OX)()?`/hotkey-window/thread/${c}`:`/local/${c}`;return r[0]",
  metadataAfter: 'y=(0,e7.OX)()?`/hotkey-window/thread/${c}`:`/local/${c}`;let MTKtitle=(0,MTKcrossTaskState._U)(MTKtitleAtom,{hostId:f??"local",threadId:c}),MTKsourceState=(0,MTKcrossTaskState._U)(MTKsourceThreadAtom,{hostId:f??"local",threadId:c}),MTKsourceTask=(f==null||f==="local")&&MTKsourceState!=null?{kind:"local",summary:MTKsourceState.summary}:null,MTKresolvedSender=MTKsenderFromSource(MTKtitle,MTKsourceTask,c);return r[0]',
  bindings: 'const MTKtitleAtom=ex.HX,MTKsourceThreadAtom=ex.ok,MTKcrossTaskState=c;',
  accent: 'const MTKdelegatedAccentColor=`var(--color-token-interactive-bg-accent-muted-context,rgba(51,156,255,.1))`;'
};

export function runBuild28661({root, command, currentHelper, attributionLabel}) {
  const owner = attributionOwner28661(root);
  let source = readRendererModule(owner);
  for (const contract of ['c=n("zTeN")', 'ex=n("tl5a")', 'sourceThreadId:c,message:d,sentAtMs:u,cwd:m,hostId:f,', 'alignment:y,accentColor:u,message:p,', 'y=void 0===d?"end":d']) unique(source, contract);
  const fields = {file: path.join(root, "webview/assets/async/907538.91f2a19777.js"), id: "tl5a", parameters: ["e", "t", "n"]};
  const metadata = readRendererModule(fields);
  for (const contract of ['HX:e8,', 'ok:()=>C.ok', 'e8=(0,a.i1)(q.u,', '"loaded"?n.title:ti(t(W.Ns,e))']) unique(metadata, contract);
  const helper = currentHelper() + attribution28661.accent;
  const applied = source.includes(helper) && (source.includes(attribution28661.appliedOwner) || source.includes(attribution28661.appliedOwner.replace('(14)', '(16)')) && source.includes('r[14]!==MTKtitle||r[15]!==c') && source.includes('paletteSourceTitle:MTKtitle,paletteSourceId:c')) && source.includes(attribution28661.metadataAfter) && source.includes(attribution28661.bindings);
  if (!applied) {
    if (source.includes('MTKresolvedSender') || source.includes('function MTKsender(')) throw new Error('Upstream changed: partial attribution module patch');
    const label = attributionLabel('a', 'n', 't');
    const replacements = [
      [attribution28661.owner, helper + attribution28661.appliedOwner],
      [attribution28661.metadataBefore, attribution28661.metadataAfter],
      [',r[1]=n):n=r[1],r[2]!==v', ',r[1]=n):n=r[1],'+label.slice(0,-1)+',r[2]!==v'],
      ['r[10]!==u||r[11]!==s?(l=(0,a.jsx)(ee,', 'r[10]!==u||r[11]!==s||r[13]!==n?(l=(0,a.jsx)(ee,'],
      ['compactActions:x,onLabelClick:s}),r[5]=x', 'compactActions:x,onLabelClick:s,alignment:`end`,accentColor:MTKdelegatedAccentColor}),r[5]=x'],
      ['r[10]=u,r[11]=s,r[12]=l', 'r[10]=u,r[11]=s,r[13]=n,r[12]=l']
    ];
    for (const [before] of replacements) unique(source, before);
    if (command === 'apply') {
      for (const [before, after] of replacements) source = source.replace(before, () => after);
      source += ';'+attribution28661.bindings;
      if (!source.includes(helper) || !source.includes(attribution28661.metadataAfter)) throw new Error('Attribution helper insertion did not verify');
      writeRendererModule(owner, source);
    }
  }
  return {state: applied || command === 'apply' ? 'applied' : 'needs-apply', targets: [path.relative(root, owner.file)]};
}

function unique(source, contract) {
  if (source.split(contract).length !== 2) throw new Error(`Upstream changed: attribution module contract is not unique: ${contract}`);
}
