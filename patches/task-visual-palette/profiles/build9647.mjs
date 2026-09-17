const bridgeBefore = "const MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function mkn(";
const bridgeAfter = "const MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0,MTKsidebarArchiveSubscribe=e=>globalThis.__MTKsidebarArchiveSubscribe?.(e)??(()=>{}),MTKsidebarArchiveSnapshot=()=>globalThis.__MTKsidebarArchiveSnapshot?.()??0;function MTKuseSidebarArchivePolicy(e){return e.useSyncExternalStore(MTKsidebarArchiveSubscribe,MTKsidebarArchiveSnapshot,MTKsidebarArchiveSnapshot)}function mkn(";

const defaultLocalOwner = {
  contextResult: "Ze",
  inlineDeclaration: "let Qe=oD(Ze),$e=S&&x,et",
  inlinePin: "$e",
  inlineResult: "et"
};

function runtimeReplacements(localOwner = defaultLocalOwner) {
  const local = { ...defaultLocalOwner, ...localOwner };
  return [
  [bridgeBefore, bridgeAfter, "build-9647 archive reload bridge"],
  [
    "function aAn(e){let t=(0,wQ.c)(154),",
    "function aAn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(sAn),t=(0,wQ.c)(156),",
    "build-9647 local row archive subscription"
  ],
  [
    `,${local.contextResult};t[71]!==x`,
    `,${local.contextResult};t[154]!==MTKsidebarArchiveEpoch||t[71]!==x`,
    "build-9647 local context archive invalidation"
  ],
  [
    `t[88]=w,t[89]=${local.contextResult}):${local.contextResult}=t[89]`,
    `t[88]=w,t[154]=MTKsidebarArchiveEpoch,t[89]=${local.contextResult}):${local.contextResult}=t[89]`,
    "build-9647 local context archive snapshot"
  ],
  [
    `${local.inlineDeclaration};t[90]!==n`,
    `${local.inlineDeclaration};t[155]!==MTKsidebarArchiveEpoch||t[90]!==n`,
    "build-9647 local inline archive invalidation"
  ],
  [
    `t[100]=${local.inlinePin},t[101]=${local.inlineResult}):${local.inlineResult}=t[101]`,
    `t[100]=${local.inlinePin},t[155]=MTKsidebarArchiveEpoch,t[101]=${local.inlineResult}):${local.inlineResult}=t[101]`,
    "build-9647 local inline archive snapshot"
  ],
  [
    "var mAn,OQ,kQ,hAn=t((()=>{mAn=a(),",
    "var MTKarchiveReact,mAn,OQ,kQ,hAn=t((()=>{MTKarchiveReact=n(i(),1),mAn=a(),",
    "build-9647 cloud row React owner"
  ],
  [
    "function fAn(e){let t=(0,mAn.c)(89),",
    "function fAn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(MTKarchiveReact),t=(0,mAn.c)(90),",
    "build-9647 cloud row archive subscription"
  ],
  ["let Je;t[78]!==xe", "let Je;t[89]!==MTKsidebarArchiveEpoch||t[78]!==xe", "build-9647 cloud context archive invalidation"],
  [
    "t[84]=L,t[85]=Je):Je=t[85]",
    "t[84]=L,t[89]=MTKsidebarArchiveEpoch,t[85]=Je):Je=t[85]",
    "build-9647 cloud context archive snapshot"
  ],
  [
    "function AAn(e){let t=(0,NQ.c)(177),",
    "function AAn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(RAn),t=(0,NQ.c)(178),",
    "build-9647 unified row archive subscription"
  ],
  ["let tt=et,nt;t[77]!==u", "let tt=et,nt;t[177]!==MTKsidebarArchiveEpoch||t[77]!==u", "build-9647 remote archive invalidation"],
  [
    "t[111]=O,t[112]=nt):nt=t[112]",
    "t[111]=O,t[177]=MTKsidebarArchiveEpoch,t[112]=nt):nt=t[112]",
    "build-9647 remote archive snapshot"
  ]
  ];
}

export const build9647ArchiveRuntimeContracts = runtimeReplacements().map(([, after]) => after);
export const build9647ArchiveRuntimeReplacedContracts = runtimeReplacements().map(([before]) => before);

export function applyBuild9647ArchiveRuntime(source, localOwner) {
  for (const replacement of runtimeReplacements(localOwner)) source = replaceOnce(source, ...replacement);
  return source;
}

export function inspectBuild9647ArchiveRuntime(source, localOwner) {
  const replacements = runtimeReplacements(localOwner);
  const before = replacements.filter(([value]) => source.includes(value)).length;
  const after = replacements.filter(([, value]) => source.includes(value)).length;
  if (before === replacements.length && after === 0) return "needs-apply";
  if (before === 0 && after === replacements.length) return "applied";
  throw new Error(`Unrecognized build-9647 archive runtime state: before=${before} after=${after}`);
}

function replaceOnce(source, before, after, label) {
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`missing ${label}`);
  if (source.indexOf(before, first + before.length) >= 0) throw new Error(`ambiguous ${label}`);
  return source.slice(0, first) + after + source.slice(first + before.length);
}
