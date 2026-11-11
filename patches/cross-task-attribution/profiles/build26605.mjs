import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";

export function attributionOwner26605(root) {
  return {file: path.join(root, "webview/assets/async/720744.158c9ed7b0.js"), id: "kaM7", parameters: ["e", "t", "n"]};
}

export const attribution26605 = {
  owner: 'function tn(e){let t,n,i,l,o=(0,s.c)(13),',
  appliedOwner: 'function tn(e){let t,n,i,l,o=(0,s.c)(14),',
  metadataBefore: "y=(0,e9.OX)()?`/hotkey-window/thread/${c}`:`/local/${c}`;return o[0]",
  metadataAfter: 'y=(0,e9.OX)()?`/hotkey-window/thread/${c}`:`/local/${c}`;let MTKtitle=(0,MTKcrossTaskState._U)(MTKtitleAtom,{hostId:f??"local",threadId:c}),MTKsourceState=(0,MTKcrossTaskState._U)(MTKsourceThreadAtom,{hostId:f??"local",threadId:c}),MTKsourceTask=(f==null||f==="local")&&MTKsourceState!=null?{kind:"local",summary:MTKsourceState.summary}:null,MTKresolvedSender=MTKsenderFromSource(MTKtitle,MTKsourceTask,c);return o[0]',
  bindings: 'const MTKtitleAtom=ex.HX,MTKsourceThreadAtom=ex.ok,MTKcrossTaskState=c;',
  accent: 'const MTKdelegatedAccentColor=`var(--color-token-interactive-bg-accent-muted-context,rgba(51,156,255,.1))`;'
};

export function runBuild26605({root, command, currentHelper, attributionLabel}) {
  const owner = attributionOwner26605(root);
  let source = readRendererModule(owner);
  for (const contract of ['c=n("zTeN")', 'ex=n("tl5a")', 'sourceThreadId:c,message:d,sentAtMs:u,cwd:m,hostId:f,', 'alignment:y,accentColor:u,message:p,', 'y=void 0===d?"end":d']) unique(source, contract);
  const fields = {file: path.join(root, "webview/assets/async/739301.37a39f26d6.js"), id: "tl5a", parameters: ["e", "t", "n"]};
  const metadata = readRendererModule(fields);
  for (const contract of ['HX:e8,', 'ok:()=>T.ok', 'e8=(0,a.i1)(B.u,', '"loaded"?n.title:ti(t(j.Ns,e))']) unique(metadata, contract);
  const helper = currentHelper() + attribution26605.accent;
  const applied = source.includes(helper) && (source.includes(attribution26605.appliedOwner) || source.includes(attribution26605.appliedOwner.replace('(14)', '(16)')) && source.includes('o[14]!==MTKtitle||o[15]!==c') && source.includes('paletteSourceTitle:MTKtitle,paletteSourceId:c')) && source.includes(attribution26605.metadataAfter) && source.includes(attribution26605.bindings);
  if (!applied) {
    if (source.includes('MTKresolvedSender') || source.includes('function MTKsender(')) throw new Error('Upstream changed: partial attribution module patch');
    const label = attributionLabel('a', 'n', 't');
    const replacements = [
      [attribution26605.owner, helper + attribution26605.appliedOwner],
      [attribution26605.metadataBefore, attribution26605.metadataAfter],
      [',o[1]=n):n=o[1],o[2]!==v', ',o[1]=n):n=o[1],'+label.slice(0,-1)+',o[2]!==v'],
      ['o[10]!==u||o[11]!==i?(l=(0,a.jsx)(ee,', 'o[10]!==u||o[11]!==i||o[13]!==n?(l=(0,a.jsx)(ee,'],
      ['compactActions:x,onLabelClick:i}),o[5]=x', 'compactActions:x,onLabelClick:i,alignment:`end`,accentColor:MTKdelegatedAccentColor}),o[5]=x'],
      ['o[10]=u,o[11]=i,o[12]=l', 'o[10]=u,o[11]=i,o[13]=n,o[12]=l']
    ];
    for (const [before] of replacements) unique(source, before);
    if (command === 'apply') {
      for (const [before, after] of replacements) source = source.replace(before, () => after);
      source += ';'+attribution26605.bindings;
      if (!source.includes(helper) || !source.includes(attribution26605.metadataAfter)) throw new Error('Attribution helper insertion did not verify');
      writeRendererModule(owner, source);
    }
  }
  return {state: applied || command === 'apply' ? 'applied' : 'needs-apply', targets: [path.relative(root, owner.file)]};
}

function unique(source, contract) {
  if (source.split(contract).length !== 2) throw new Error(`Upstream changed: attribution module contract is not unique: ${contract}`);
}
