#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { linuxBuild9771, linuxBuild10954 } from "./profiles/linux.mjs";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: cross-task-attribution.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const id = "[$A-Z_a-z][$\\w]*";
const attributionNameMarker = '"data-mtk-palette-attribution-name":!0';
const build9647Component = {
  delegation: "MS", delegationCache: "NS", delegationJsx: "PS",
  wrapper: "CS", wrapperCache: "wS", wrapperJsx: "TS",
  bubble: "bt", wrapperBubble: "uh", bubbleCache: "St", collapsedLines: "ES",
  bubbleCacheSize: 152,
  externalBubble: true,
  bubbleOwner: [
    "turnId:C,cwd:w,hostId:T}=e,",
    "turnId:C,cwd:w,hostId:T,messageBubbleStyle:MTKbubbleStyleOverride}=e,"
  ],
  bubbleDependency: [
    "t[45]!==G||t[46]!==U||t[47]!==Ke){",
    "t[45]!==G||t[46]!==U||t[47]!==Ke||t[152]!==MTKbubbleStyleOverride){"
  ],
  bubbleStorage: [
    "t[45]=G,t[46]=U,t[47]=Ke,t[48]=q",
    "t[45]=G,t[46]=U,t[47]=Ke,t[152]=MTKbubbleStyleOverride,t[48]=q"
  ]
};
const build9922Component = {
  delegation: "oy", delegationCache: "sy", delegationJsx: "cy",
  wrapper: "Zv", wrapperCache: "Qv", wrapperJsx: "$v",
  bubble: "yt", wrapperBubble: "pp", bubbleCache: "xt", collapsedLines: "ey",
  bubbleCacheSize: 153,
  externalBubble: true,
  bubbleOwner: [
    "turnId:C,cwd:w,hostId:T}=e,",
    "turnId:C,cwd:w,hostId:T,messageBubbleStyle:MTKbubbleStyleOverride}=e,"
  ],
  bubbleDependency: [
    "t[45]!==I||t[46]!==K||t[47]!==W||t[48]!==Ke){",
    "t[45]!==I||t[46]!==K||t[47]!==W||t[48]!==Ke||t[153]!==MTKbubbleStyleOverride){"
  ],
  bubbleStorage: [
    "t[45]=I,t[46]=K,t[47]=W,t[48]=Ke,t[49]=J",
    "t[45]=I,t[46]=K,t[47]=W,t[48]=Ke,t[153]=MTKbubbleStyleOverride,t[49]=J"
  ]
};
const build10789Component = {
  delegation: "_v", delegationCache: "vv", delegationJsx: "yv",
  wrapper: "cv", wrapperCache: "lv", wrapperJsx: "uv",
  bubble: "yt", wrapperBubble: "jf", bubbleCache: "xt", collapsedLines: "dv",
  bubbleCacheSize: 153,
  externalBubble: true,
  bubbleOwner: [
    "turnId:D,cwd:O,hostId:k}=e,",
    "turnId:D,cwd:O,hostId:k,messageBubbleStyle:MTKbubbleStyleOverride}=e,"
  ],
  bubbleDependency: [
    "t[47]!==ze||t[48]!==Xe){",
    "t[47]!==ze||t[48]!==Xe||t[153]!==MTKbubbleStyleOverride){"
  ],
  bubbleStorage: [
    "t[47]=ze,t[48]=Xe,t[49]=q",
    "t[47]=ze,t[48]=Xe,t[153]=MTKbubbleStyleOverride,t[49]=q"
  ]
};
const assets = path.join(root, "webview/assets");
const owner = findOwner();
let state = inspectState(owner);

if (command === "apply" && state === "needs-apply") {
  const details = inspectPristine(owner.source, owner.bubbleSource);
  const patched = patchAttribution(owner.source, owner.file, details);
  fs.writeFileSync(owner.file, patched.source);
  if (patched.bubbleSource != null) fs.writeFileSync(details.bubbleFile, patched.bubbleSource);
  syntaxCheck(owner.file);
  if (details.bubbleFile != null) syntaxCheck(details.bubbleFile);
  owner.source = patched.source;
  owner.bubbleSource = patched.bubbleSource;
  state = inspectState(owner);
  if (state !== "applied") throw new Error("cross-task attribution transform did not verify");
}

process.stdout.write(`${JSON.stringify({
  state,
  targets: [owner.file, owner.bubbleFile].filter(Boolean).map(file => path.relative(root, file))
}, null, 2)}\n`);

function findOwner() {
  if (!fs.existsSync(assets) || !fs.statSync(assets).isDirectory()) {
    throw new Error(`Missing extracted assets directory: ${assets}`);
  }
  const candidates = [];
  for (const name of fs.readdirSync(assets)) {
    if (!name.endsWith(".js")) continue;
    const file = path.join(assets, name);
    const source = fs.readFileSync(file, "utf8");
    if (source.includes("localConversation.codexDelegationUserMessage.app") &&
        source.includes("defaultMessage:`Sent by {appName} from another task`") &&
        source.includes("sourceThreadId")) {
      const labelAt = source.indexOf("localConversation.codexDelegationUserMessage.app");
      if (containingFunction(source, labelAt).text.includes("sourceThreadId")) {
        const bubbleImports = [...source.matchAll(/import\{[^}]*\bt as (?<local>[$\w]+)[^}]*\}from"(?<relative>\.\/user-message-[^"]+\.js)";/g)]
          .filter(match => source.includes(`.jsx)(${match.groups.local},{message:`));
        if (bubbleImports.length > 1) {
          throw new Error("Upstream changed: delegated bubble import is ambiguous");
        }
        const bubbleImport = bubbleImports[0];
        if (bubbleImport != null) {
          const bubbleFile = ownedImport(file, bubbleImport.groups.relative);
          candidates.push({ file, source, bubbleFile, bubbleLocal: bubbleImport.groups.local,
            bubbleSource: fs.readFileSync(bubbleFile, "utf8") });
        } else {
          candidates.push({ file, source, bubbleFile: null, bubbleLocal: null, bubbleSource: null });
        }
      }
    }
  }
  if (candidates.length !== 1) {
    throw new Error(`Upstream changed: found ${candidates.length} cross-task attribution owners`);
  }
  return candidates[0];
}

function inspectState(owner) {
  const source = owner.source;
  const completeSource = source + (owner.bubbleSource ?? "");
  const markers = [
    "var MTKdelegatedBubbleStyle=",
    "function MTKsender(",
    ["const MTKcrossTaskStoreHook=", "LX as MTKcrossTaskStoreHook", "PX as MTKcrossTaskStoreHook"],
    ["MTKcrossTaskStoreScope=", "ZI as MTKcrossTaskStoreScope", "XI as MTKcrossTaskStoreScope"],
    "MTKstore.get(MTKtitleAtom,{hostId:",
    "messageBubbleStyle:MTKdelegatedBubbleStyle",
    '"data-user-message-bubble":!0,style:MTKbubbleStyleOverride'
  ];
  const present = markers.map(marker =>
    Array.isArray(marker) ? marker.some(value => completeSource.includes(value)) : completeSource.includes(marker));
  if (present.every(Boolean)) {
    if (count(source, "function MTKsender(") !== 1 || count(source, "messageBubbleStyle:MTKdelegatedBubbleStyle") !== 1) {
      throw new Error("Unrecognized attribution patch: helper or style handoff is ambiguous");
    }
    if (!source.includes("onLabelClick:")) throw new Error("Unrecognized attribution patch: source-task click-through is missing");
    if (source.includes("className:`w-full rounded-xl px-2 py-1`") || source.includes("`bg-text/5`) max-w-")) {
      throw new Error("Unrecognized attribution patch: rejected delegated-bubble prototype remains");
    }
    if (!source.includes(currentHelper()) || !source.includes(attributionNameMarker)) {
      throw new Error("Unrecognized attribution patch: current helper or sender-name scope is missing");
    }
    return "applied";
  }
  if (present.some(Boolean)) throw new Error("Unrecognized attribution patch: partial markers");
  inspectPristine(source, owner.bubbleSource);
  return "needs-apply";
}

function inspectPristine(source, externalBubbleSource = null) {
  const labelAt = source.indexOf("localConversation.codexDelegationUserMessage.app");
  const delegation = containingFunction(source, labelAt);
  const profile = [linuxBuild10954.component, build10789Component, build9922Component,
    linuxBuild9771.component, build9647Component].find(candidate =>
    delegation.text.startsWith(`function ${candidate.delegation}(`) &&
    (candidate.externalBubble ? externalBubbleSource?.includes(`function ${candidate.bubble}(`) : source.includes(`function ${candidate.bubble}(`)) &&
    (candidate.wrapperBubble == null || owner.bubbleLocal === candidate.wrapperBubble) &&
    (candidate.bubbleOwner == null || (candidate.externalBubble ? externalBubbleSource : source).includes(candidate.bubbleOwner[0])) &&
    (candidate.marker == null || source.includes(candidate.marker)));
  if (profile == null) throw new Error("Upstream changed: attribution component family is unknown");
  const wrapper = functionAt(source, source.indexOf(`function ${profile.wrapper}(`));
  const bubbleSource = profile.externalBubble ? externalBubbleSource : source;
  const bubble = functionAt(bubbleSource, bubbleSource.indexOf(`function ${profile.bubble}(`));
  const completeSource = source + (profile.externalBubble ? bubbleSource : "");
  for (const contract of [
    `function ${profile.delegation}(e){let t=(0,${profile.delegationCache}.c)(13),{conversationId:n,sourceThreadId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c}=e,`,
    `h=(0,${profile.delegationJsx}.jsx)(${profile.wrapper},{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m})`,
    `function ${profile.wrapper}(e){let t=(0,${profile.wrapperCache}.c)(16),{label:n,conversationId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c,onLabelClick:l}=e,`,
    `m=f?(0,${profile.wrapperJsx}.jsx)(${profile.wrapperBubble ?? profile.bubble},{message:i,sentAtMs:a,collapsedLineCount:${profile.collapsedLines},compactActions:u,cwd:o,hostId:s,threadId:r}):null`,
    `function ${profile.bubble}(e){let ${profile.bubbleCacheVar ?? "t"}=(0,${profile.bubbleCache}.c)(${profile.bubbleCacheSize ?? 127}),`,
    '"data-user-message-bubble":!0,className:'
  ]) {
    if (!completeSource.includes(contract)) throw new Error(`Upstream changed: attribution contract ${contract}`);
  }
  if (!new RegExp(`d=${id}\\(\\)\\?\`/hotkey-window/thread/\\$\\{r\\}\`:\`/local/\\$\\{r\\}\``).test(delegation.text)) {
    throw new Error("Upstream changed: attribution destination route");
  }
  return {
    delegation,
    wrapper,
    bubble,
    profile,
    bubbleFile: profile.externalBubble ? owner.bubbleFile : null,
    bubbleSource
  };
}

function patchAttribution(source, ownerFile, details) {
  const imports = resolveImports(source, ownerFile);
  let delegation = details.delegation.text;
  let wrapper = details.wrapper.text;
  let bubble = details.bubble.text;
  const profile = details.profile;

  delegation = replaceOnce(delegation, `function ${profile.delegation}(e){let t=(0,${profile.delegationCache}.c)(13),`, `function ${profile.delegation}(e){let t=(0,${profile.delegationCache}.c)(14),`, "delegation cache size");
  const labelEnd = ",t[1]=p):p=t[1];";
  const metadata =
    `let MTKstore=MTKcrossTaskStoreHook(MTKcrossTaskStoreScope),MTKtitle=MTKstore.get(MTKtitleAtom,{hostId:s??\`local\`,threadId:r}),` +
    `MTKresolvedSender=MTKsender(MTKtitle,MTKprojectFromCwd(o));${attributionLabel(profile.delegationJsx)}`;
  delegation = replaceOnce(delegation, labelEnd, labelEnd + metadata, "delegation metadata insertion");
  delegation = replaceOnce(
    delegation,
    "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m?(",
    "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p?(",
    "delegation label dependency"
  );
  delegation = replaceOnce(
    delegation,
    "onLabelClick:m}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[12]=h)",
    "onLabelClick:m,messageBubbleStyle:MTKdelegatedBubbleStyle}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[12]=h)",
    "delegated bubble style handoff"
  );

  wrapper = replaceOnce(wrapper, `function ${profile.wrapper}(e){let t=(0,${profile.wrapperCache}.c)(16),`, `function ${profile.wrapper}(e){let t=(0,${profile.wrapperCache}.c)(17),`, "wrapper cache size");
  wrapper = replaceOnce(wrapper, "compactActions:c,onLabelClick:l}=e,", "compactActions:c,onLabelClick:l,messageBubbleStyle:MTKbubbleStyleOverride}=e,", "wrapper style prop");
  wrapper = replaceOnce(wrapper, "cwd:o,hostId:s,threadId:r})", "cwd:o,hostId:s,threadId:r,messageBubbleStyle:MTKbubbleStyleOverride})", "bubble style prop");
  wrapper = replaceOnce(
    wrapper,
    "t[5]!==u||t[6]!==r||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==f?(",
    "t[5]!==u||t[6]!==r||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==f||t[16]!==MTKbubbleStyleOverride?(",
    "wrapper style dependency"
  );
  wrapper = replaceOnce(wrapper, "t[10]=a,t[11]=f,t[12]=m)", "t[10]=a,t[11]=f,t[16]=MTKbubbleStyleOverride,t[12]=m)", "wrapper style storage");

  const bubbleCacheSize = profile.bubbleCacheSize ?? 127;
  const bubbleCacheVar = profile.bubbleCacheVar ?? "t";
  bubble = replaceOnce(bubble, `function ${profile.bubble}(e){let ${bubbleCacheVar}=(0,${profile.bubbleCache}.c)(${bubbleCacheSize}),`, `function ${profile.bubble}(e){let ${bubbleCacheVar}=(0,${profile.bubbleCache}.c)(${bubbleCacheSize + 1}),`, "bubble cache size");
  const bubbleOwner = profile.bubbleOwner ?? (bubble.includes("cwd:D,hostId:O}=e,") ?
    ["cwd:D,hostId:O}=e,", "cwd:D,hostId:O,messageBubbleStyle:MTKbubbleStyleOverride}=e,"] :
    ["cwd:E,hostId:D}=e,", "cwd:E,hostId:D,messageBubbleStyle:MTKbubbleStyleOverride}=e,"]);
  bubble = replaceOnce(bubble, ...bubbleOwner, "bubble style destructuring");
  const bubbleDependency = profile.bubbleDependency ?? (bubble.includes("t[42]!==de||t[43]!==ae||t[44]!==_e){") ?
    ["t[42]!==de||t[43]!==ae||t[44]!==_e){", "t[42]!==de||t[43]!==ae||t[44]!==_e||t[127]!==MTKbubbleStyleOverride){"] :
    bubble.includes("t[42]!==de||t[43]!==oe||t[44]!==_e){") ?
      ["t[42]!==de||t[43]!==oe||t[44]!==_e){", "t[42]!==de||t[43]!==oe||t[44]!==_e||t[127]!==MTKbubbleStyleOverride){"] :
      ["t[42]!==fe||t[43]!==se||t[44]!==ve){", "t[42]!==fe||t[43]!==se||t[44]!==ve||t[127]!==MTKbubbleStyleOverride){"]);
  bubble = replaceOnce(bubble, ...bubbleDependency, "bubble style cache dependency");
  bubble = replaceOnce(bubble, '"data-user-message-bubble":!0,className:', '"data-user-message-bubble":!0,style:MTKbubbleStyleOverride,className:', "bubble semantic accent");
  const bubbleStorage = profile.bubbleStorage ?? (bubble.includes("t[42]=de,t[43]=ae,t[44]=_e,t[45]=ve") ?
    ["t[42]=de,t[43]=ae,t[44]=_e,t[45]=ve", "t[42]=de,t[43]=ae,t[44]=_e,t[127]=MTKbubbleStyleOverride,t[45]=ve"] :
    bubble.includes("t[42]=de,t[43]=oe,t[44]=_e,t[45]=ve") ?
      ["t[42]=de,t[43]=oe,t[44]=_e,t[45]=ve", "t[42]=de,t[43]=oe,t[44]=_e,t[127]=MTKbubbleStyleOverride,t[45]=ve"] :
      ["t[42]=fe,t[43]=se,t[44]=ve,t[45]=be", "t[42]=fe,t[43]=se,t[44]=ve,t[127]=MTKbubbleStyleOverride,t[45]=be"]);
  bubble = replaceOnce(bubble, ...bubbleStorage, "bubble style storage");

  const helper = currentHelper() + (imports.sharedImport == null ?
    `const MTKcrossTaskStoreHook=${imports.storeHook},MTKcrossTaskStoreScope=${imports.storeScope};` : "");

  let bubbleSource = null;
  if (details.bubbleFile == null) source = replaceOnce(source, details.bubble.text, bubble, "bubble component");
  else bubbleSource = replaceOnce(details.bubbleSource, details.bubble.text, bubble, "bubble component");
  source = replaceOnce(source, details.wrapper.text, wrapper, "delegation wrapper component");
  source = replaceOnce(source, details.delegation.text, helper + delegation, "delegation component");
  source = replaceOnce(source, imports.before, imports.after, "attribution imports");
  if (imports.sharedImport != null) {
    source = replaceOnce(source, imports.sharedImport.before, imports.sharedImport.after, "attribution shared-store import");
  }
  return {source, bubbleSource};
}

function attributionLabel(jsx) {
  return `MTKresolvedSender!=null&&(p=(0,${jsx}.jsxs)(${jsx}.Fragment,{children:[f,\`Sent by \`,(0,${jsx}.jsx)(\`span\`,{${attributionNameMarker},children:MTKresolvedSender})]}));`;
}

function currentHelper() {
  return "var MTKdelegatedBubbleStyle={backgroundColor:`var(--color-token-interactive-bg-accent-muted-context,rgba(51,156,255,.1))`};" +
    "function MTKshortTaskTitle(e){if(typeof e!==`string`)return null;let t=e.trim();if(t.length===0)return null;" +
    "let n=t.indexOf(` — `);return n>0?t.slice(0,n).trim():t}" +
    "function MTKprojectFromCwd(e,t){if(t===`projectless`||typeof e!==`string`)return null;let n=e.replace(/[\\\\/]+$/u,``).split(/[\\\\/]/u).pop();return n&&n!==`.`?n:null}" +
    "function MTKsender(e,t){let n=MTKshortTaskTitle(e);if(n==null)return null;return n!==e.trim()?n:" +
    "typeof t===`string`&&t.trim().length>0?`${t.trim()}/${n}`:n}";
}

function resolveImports(ownerSource, ownerFile) {
  const primaryImport = uniqueMatch(ownerSource, /import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-primary-[^"]+\.js)";/g, "app-primary import");
  const initialImport = uniqueMatch(ownerSource, /import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-initial-[^"]+\.js)";/g, "app-initial import");
  const appPrimaryFile = ownedImport(ownerFile, primaryImport.groups.relative);
  const appInitialFile = ownedImport(ownerFile, initialImport.groups.relative);
  const appPrimary = fs.readFileSync(appPrimaryFile, "utf8");
  const appInitial = fs.readFileSync(appInitialFile, "utf8");
  if (appInitial.includes("yBs=ns(X,(e,{get:t})=>") &&
      appInitial.includes("_Bs({...n,localTitle:r})") &&
      appInitial.includes("function Bzc(){let e=(0,Uzc.c)(12),t=jr(X),")) {
    const sharedImport = uniqueMatch(ownerSource,
      /import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-shared-[^"]+\.js)";/g,
      "app-shared import");
    if (!appInitial.includes("LX as jr") || !appInitial.includes("ZI as X")) {
      throw new Error("Upstream changed: build-10789 store binding is missing");
    }
    return {
      before: initialImport[0],
      after: `import{${initialImport.groups.specifiers},${exportedAs(appInitial, "yBs")} as MTKtitleAtom}from"${initialImport.groups.relative}";`,
      storeHook: "MTKcrossTaskStoreHook",
      storeScope: "MTKcrossTaskStoreScope",
      sharedImport: {
        before: sharedImport[0],
        after: `import{${sharedImport.groups.specifiers},LX as MTKcrossTaskStoreHook,ZI as MTKcrossTaskStoreScope}from"${sharedImport.groups.relative}";`
      }
    };
  }
  const linuxSelector = [linuxBuild10954.titleSelector, linuxBuild9771.titleSelector].find(selector =>
    appInitial.includes(selector.atomOwner) &&
    appInitial.includes(selector.helperOwner) &&
    appInitial.includes(selector.storeOwner));
  if (linuxSelector != null) {
    if (linuxSelector.sharedStoreExports != null) {
      const sharedImport = uniqueMatch(ownerSource,
        /import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-shared-[^"]+\.js)";/g,
        "app-shared import");
      const {hook, scope} = linuxSelector.sharedStoreExports;
      if (!appInitial.includes(`${hook} as ${linuxSelector.storeHook}`) ||
          !appInitial.includes(`${scope} as ${linuxSelector.storeScope}`)) {
        throw new Error("Upstream changed: Linux renderer store binding is missing");
      }
      return {
        before: initialImport[0],
        after: `import{${initialImport.groups.specifiers},${exportedAs(appInitial, linuxSelector.atom)} as MTKtitleAtom}from"${initialImport.groups.relative}";`,
        storeHook: "MTKcrossTaskStoreHook",
        storeScope: "MTKcrossTaskStoreScope",
        sharedImport: {
          before: sharedImport[0],
          after: `import{${sharedImport.groups.specifiers},${hook} as MTKcrossTaskStoreHook,${scope} as MTKcrossTaskStoreScope}from"${sharedImport.groups.relative}";`
        }
      };
    }
    return {
      before: initialImport[0],
      after: `import{${initialImport.groups.specifiers},${exportedAs(appInitial, linuxSelector.atom)} as MTKtitleAtom}from"${initialImport.groups.relative}";`,
      storeHook: importedLocal(initialImport.groups.specifiers, exportedAs(appInitial, linuxSelector.storeHook)),
      storeScope: importedLocal(initialImport.groups.specifiers, exportedAs(appInitial, linuxSelector.storeScope))
    };
  }
  if (appInitial.includes("uyc=uf($,(e,{get:t})=>") &&
      appInitial.includes("cyc({...n,localTitle:r})") &&
      appInitial.includes("function Vvl(){let e=(0,Wvl.c)(12),t=xf($),")) {
    return {
      before: initialImport[0],
      after: `import{${initialImport.groups.specifiers},${exportedAs(appInitial, "uyc")} as MTKtitleAtom}from"${initialImport.groups.relative}";`,
      storeHook: importedLocal(initialImport.groups.specifiers, exportedAs(appInitial, "xf")),
      storeScope: importedLocal(initialImport.groups.specifiers, exportedAs(appInitial, "$"))
    };
  }
  const titleMarker = appPrimary.indexOf("localTitle:r})})}));");
  if (titleMarker >= 0) {
    const beforeTitle = appPrimary.slice(Math.max(0, titleMarker - 1600), titleMarker);
    const candidates = [...beforeTitle.matchAll(new RegExp(`(?<atom>${id})=(?:iS|wx|Rt)\\((?<scope>${id}),`, "g"))];
    const titleSelector = candidates.at(-1);
    if (titleSelector == null || !beforeTitle.slice(titleSelector.index).includes("hasConversation")) {
      throw new Error("Upstream changed: current task-title selector owner is ambiguous");
    }
    const storeHookInternal = currentStoreHookInternal(appInitial);
    return {
      before: primaryImport[0],
      after: `import{${primaryImport.groups.specifiers},${exportedAs(appPrimary, titleSelector.groups.atom)} as MTKtitleAtom}from"${primaryImport.groups.relative}";`,
      storeHook: importedLocal(initialImport.groups.specifiers, exportedAs(appInitial, storeHookInternal)),
      storeScope: importedLocal(initialImport.groups.specifiers, exportedAs(appInitial, "Q"))
    };
  }
  throw new Error("Upstream changed: build-9647 task-title selector owner is missing");
}

function currentStoreHookInternal(source) {
  const marker = source.indexOf("sidebarElectron.recentChats");
  if (marker >= 0) {
    const owner = containingFunction(source, marker).text;
    const current = [...owner.matchAll(new RegExp(`let e=\\(0,${id}\\.c\\)\\(12\\),t=(?<hook>${id})\\(Q\\),`, "g"))];
    if (current.length === 1) return current[0].groups.hook;
    if (current.length > 1) throw new Error("Upstream changed: current store hook owner is ambiguous");
  }
  throw new Error("Upstream changed: build-9647 renderer store hook owner is missing");
}

function ownedImport(ownerFile, relative) {
  const file = path.resolve(path.dirname(ownerFile), relative);
  if (!file.startsWith(path.resolve(root) + path.sep)) throw new Error("App import escaped extraction root");
  return file;
}

function exportedAs(source, internal) {
  const specifiers = uniqueMatch(source, /export\{(?<specifiers>[^}]+)\}/g, "module export list").groups.specifiers;
  return uniqueMatch(specifiers, new RegExp(`(?:^|,)${escapeRegExp(internal)} as (?<export>${id})(?=,|$)`, "g"), `export for ${internal}`).groups.export;
}

function importedLocal(specifiers, exported) {
  return uniqueMatch(specifiers, new RegExp(`(?:^|,)${escapeRegExp(exported)} as (?<local>${id})(?=,|$)`, "g"), `existing import for ${exported}`).groups.local;
}

function containingFunction(source, position) {
  let start = source.lastIndexOf("function ", position);
  while (start >= 0) {
    const candidate = functionAt(source, start);
    if (position < candidate.end) return candidate;
    start = source.lastIndexOf("function ", start - 1);
  }
  throw new Error("Could not locate containing function");
}

function functionAt(source, start) {
  if (start < 0 || !source.startsWith("function ", start)) throw new Error("Function start is missing");
  const open = source.indexOf("{", start);
  let quote = null;
  let escaped = false;
  let depth = 1;
  for (let index = open + 1; index < source.length; index += 1) {
    const char = source[index];
    if (quote != null) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === "'" || char === '"' || char === "`") quote = char;
    else if (char === "{") depth += 1;
    else if (char === "}" && --depth === 0) return { start, end: index + 1, text: source.slice(start, index + 1) };
  }
  throw new Error("Function did not terminate");
}

function uniqueMatch(source, pattern, label) {
  const regex = pattern.global ? pattern : new RegExp(pattern.source, pattern.flags + "g");
  const matches = [...source.matchAll(regex)];
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} matches for ${label}`);
  return matches[0];
}

function replaceOnce(source, before, after, label) {
  const first = source.indexOf(before);
  if (first < 0 || source.indexOf(before, first + before.length) >= 0) {
    throw new Error(`Upstream changed: ${label} is not unique`);
  }
  return source.slice(0, first) + after + source.slice(first + before.length);
}

function syntaxCheck(file) {
  const result = spawnSync(process.execPath, ["--input-type=module", "--check"], {
    encoding: "utf8",
    input: fs.readFileSync(file),
    maxBuffer: 64 * 1024 * 1024
  });
  if (result.status !== 0) {
    const output = result.stderr || result.stdout;
    const summary = output.match(/SyntaxError:[^\n]*/)?.[0] ?? output.trim().slice(-1000);
    throw new Error(`module syntax check failed for ${path.relative(root, file)}: ${summary}`);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function count(value, needle) {
  return value.split(needle).length - 1;
}
