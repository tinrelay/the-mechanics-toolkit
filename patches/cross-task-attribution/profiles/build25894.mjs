import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";

export function attributionOwner25894(root) {
  return {file: path.join(root, "webview/assets/async/225284.63835849b6.js"), id: "O3Io", parameters: ["e", "t", "n"]};
}

export const attribution25894 = {
  owner: 'function e5(e){let t,n,i,l,o=(0,s.c)(13),',
  appliedOwner: 'function e5(e){let t,n,i,l,o=(0,s.c)(14),',
  metadataBefore: "y=(0,e2.OX)()?`/hotkey-window/thread/${c}`:`/local/${c}`;return o[0]",
  metadataAfter: 'y=(0,e2.OX)()?`/hotkey-window/thread/${c}`:`/local/${c}`;let MTKtitle=(0,MTKcrossTaskState._U)(MTKtitleAtom,{hostId:f??"local",threadId:c}),MTKsourceState=(0,MTKcrossTaskState._U)(MTKsourceThreadAtom,{hostId:f??"local",threadId:c}),MTKsourceTask=(f==null||f==="local")&&MTKsourceState!=null?{kind:"local",summary:MTKsourceState.summary}:null,MTKresolvedSender=MTKsenderFromSource(MTKtitle,MTKsourceTask,c);return o[0]',
  bindings: 'const MTKtitleAtom=eh.HX,MTKsourceThreadAtom=eh.ok,MTKcrossTaskState=c;',
  accent: 'const MTKdelegatedAccentColor=`var(--color-token-interactive-bg-accent-muted-context,rgba(51,156,255,.1))`;'
};

export function runBuild25894({root, command, currentHelper, attributionLabel}) {
  const owner = attributionOwner25894(root);
  let source = readRendererModule(owner);
  for (const contract of ['c=n("zTeN")', 'eh=n("tl5a")', 'sourceThreadId:c,message:d,sentAtMs:u,cwd:h,hostId:f,', 'alignment:y,accentColor:u,message:p,', 'y=void 0===d?"end":d']) unique(source, contract);
  const fields = {file: path.join(root, "webview/assets/async/182735.7f13786b92.js"), id: "tl5a", parameters: ["e", "t", "n"]};
  const metadata = readRendererModule(fields);
  for (const contract of ['HX:e9,', 'ok:()=>T.ok', 'e9=(0,a.i1)(B.u,', '"loaded"?n.title:tr(t(j.Ns,e))']) unique(metadata, contract);
  const helper = currentHelper() + attribution25894.accent;
  const applied = source.includes(helper) && (source.includes(attribution25894.appliedOwner) || source.includes(attribution25894.appliedOwner.replace('(14)', '(16)')) && source.includes('o[14]!==MTKtitle||o[15]!==c') && source.includes('paletteSourceTitle:MTKtitle,paletteSourceId:c')) && source.includes(attribution25894.metadataAfter) && source.includes(attribution25894.bindings);
  if (!applied) {
    if (source.includes('MTKresolvedSender') || source.includes('function MTKsender(')) throw new Error('Upstream changed: partial attribution module patch');
    const label = attributionLabel('a', 'n', 't');
    const replacements = [
      [attribution25894.owner, helper + attribution25894.appliedOwner],
      [attribution25894.metadataBefore, attribution25894.metadataAfter],
      [',o[1]=n):n=o[1],o[2]!==v', ',o[1]=n):n=o[1],'+label.slice(0,-1)+',o[2]!==v'],
      ['o[10]!==u||o[11]!==i?(l=(0,a.jsx)(J,', 'o[10]!==u||o[11]!==i||o[13]!==n?(l=(0,a.jsx)(J,'],
      ['compactActions:x,onLabelClick:i}),o[5]=x', 'compactActions:x,onLabelClick:i,alignment:`end`,accentColor:MTKdelegatedAccentColor}),o[5]=x'],
      ['o[10]=u,o[11]=i,o[12]=l', 'o[10]=u,o[11]=i,o[13]=n,o[12]=l']
    ];
    for (const [before] of replacements) unique(source, before);
    if (command === 'apply') {
      for (const [before, after] of replacements) source = source.replace(before, () => after);
      source += ';'+attribution25894.bindings;
      if (!source.includes(helper) || !source.includes(attribution25894.metadataAfter)) throw new Error('Attribution helper insertion did not verify');
      writeRendererModule(owner, source);
    }
  }
  return {state: applied || command === 'apply' ? 'applied' : 'needs-apply', targets: [path.relative(root, owner.file)]};
}

function unique(source, contract) {
  if (source.split(contract).length !== 2) throw new Error(`Upstream changed: attribution module contract is not unique: ${contract}`);
}
