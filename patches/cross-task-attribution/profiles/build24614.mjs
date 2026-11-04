import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";

export function attributionOwner24614(root) {
  return {file: path.join(root, "webview/assets/async/366297.f0d89078fe.js"), id: "O3Io", parameters: ["e", "t", "n"]};
}

export const attribution24614 = {
  owner: 'function eX(e){let t,n,i,o,l=(0,a.c)(13),',
  appliedOwner: 'function eX(e){let t,n,i,o,l=(0,a.c)(14),',
  metadataBefore: 'y=(0,eK.OX)()?`/hotkey-window/thread/${c}`:`/local/${c}`;return l[0]',
  metadataAfter: 'y=(0,eK.OX)()?`/hotkey-window/thread/${c}`:`/local/${c}`;let MTKtitle=(0,MTKcrossTaskState._U)(MTKtitleAtom,{hostId:f??"local",threadId:c}),MTKsourceState=(0,MTKcrossTaskState._U)(MTKsourceThreadAtom,{hostId:f??"local",threadId:c}),MTKsourceTask=(f==null||f==="local")&&MTKsourceState!=null?{kind:"local",summary:MTKsourceState.summary}:null,MTKresolvedSender=MTKsenderFromSource(MTKtitle,MTKsourceTask,c);return l[0]',
  bindings: 'const MTKtitleAtom=ed.HX,MTKsourceThreadAtom=ed.ok,MTKcrossTaskState=r;',
  accent: 'const MTKdelegatedAccentColor=`var(--color-token-interactive-bg-accent-muted-context,rgba(51,156,255,.1))`;'
};

export function runBuild24614({root, command, currentHelper, attributionLabel}) {
  const owner = attributionOwner24614(root);
  let source = readRendererModule(owner);
  for (const contract of ['r=n("y5DF")', 'ed=n("tl5a")', 'sourceThreadId:c,message:d,sentAtMs:p,cwd:h,hostId:f,', 'alignment:y,accentColor:u,message:p,', 'y=void 0===d?"end":d']) unique(source, contract);
  const fields = {file: path.join(root, "webview/assets/async/24191.589dcc9878.js"), id: "tl5a", parameters: ["e", "t", "n"]};
  const metadata = readRendererModule(fields);
  for (const contract of ['HX:e7,', 'ok:()=>T.ok', 'e7=(0,a.i1)(B.u,', '"loaded"?n.title:ti(t(j.Ns,e))']) unique(metadata, contract);
  const helper = currentHelper() + attribution24614.accent;
  const applied = source.includes(helper) && (source.includes(attribution24614.appliedOwner) || source.includes(attribution24614.appliedOwner.replace('(14)', '(16)')) && source.includes('l[14]!==MTKtitle||l[15]!==c') && source.includes('paletteSourceTitle:MTKtitle,paletteSourceId:c')) && source.includes(attribution24614.metadataAfter) && source.includes(attribution24614.bindings);
  if (!applied) {
    if (source.includes('MTKresolvedSender') || source.includes('function MTKsender(')) throw new Error('Upstream changed: partial attribution module patch');
    const label = attributionLabel('s', 'n', 't');
    const replacements = [
      [attribution24614.owner, helper + attribution24614.appliedOwner],
      [attribution24614.metadataBefore, attribution24614.metadataAfter],
      [',l[1]=n):n=l[1],l[2]!==v', ',l[1]=n):n=l[1],'+label.slice(0,-1)+',l[2]!==v'],
      ['l[10]!==p||l[11]!==i?(o=(0,s.jsx)(Z,', 'l[10]!==p||l[11]!==i||l[13]!==n?(o=(0,s.jsx)(Z,'],
      ['compactActions:x,onLabelClick:i}),l[5]=x', 'compactActions:x,onLabelClick:i,alignment:`end`,accentColor:MTKdelegatedAccentColor}),l[5]=x'],
      ['l[10]=p,l[11]=i,l[12]=o', 'l[10]=p,l[11]=i,l[13]=n,l[12]=o']
    ];
    for (const [before] of replacements) unique(source, before);
    if (command === 'apply') {
      for (const [before, after] of replacements) source = source.replace(before, () => after);
      source += ';'+attribution24614.bindings;
      if (!source.includes(helper) || !source.includes(attribution24614.metadataAfter)) throw new Error('Attribution helper insertion did not verify');
      writeRendererModule(owner, source);
    }
  }
  return {state: applied || command === 'apply' ? 'applied' : 'needs-apply', targets: [path.relative(root, owner.file)]};
}

function unique(source, contract) {
  if (source.split(contract).length !== 2) throw new Error(`Upstream changed: attribution module contract is not unique: ${contract}`);
}
