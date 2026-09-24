const linux10954ArchiveBehavior = [
  ["function PUs(", "function MTKuseSidebarArchivePolicy(e){return e.useSyncExternalStore(MTKsidebarArchiveSubscribe,MTKsidebarArchiveSnapshot,MTKsidebarArchiveSnapshot)}function PUs("],
  ["archive:T?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}", "archive:T||MTKsidebarArchiveProtected(h)?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}"],
  ["function PUs({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i}){return r.length<2?e:", "function PUs({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i,archiveProtected:a}){return a&&(e=e.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`)),r.length<2?e:"],
  ["selectedThreadKeys:HLs(E,r),threadKey:r})", "selectedThreadKeys:HLs(E,r),threadKey:r,archiveProtected:HLs(E,r).some(e=>MTKsidebarArchiveProtected(Pw(e)))})"],
  ["selectedThreadKeys:HLs(re,e),threadKey:e})", "selectedThreadKeys:HLs(re,e),threadKey:e,archiveProtected:HLs(re,e).some(e=>MTKsidebarArchiveProtected(Pw(e)))})"],
  ["archive:t!=null&&(Ye||oe)?tt:t,getMenuItems:", "archive:MTKsidebarArchiveProtected(n)?null:t!=null&&(Ye||oe)?tt:t,getMenuItems:"],
  ["let Ye=Ae?ze:null", "let Ye=Ae&&!MTKsidebarArchiveProtected(me)?ze:null"],
  ["if(Ae&&e.push({id:`archive-task`", "if(Ae&&!MTKsidebarArchiveProtected(me)&&e.push({id:`archive-task`"],
  ["archive:n,getMenuItems:se?e=>l([", "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:se&&!MTKsidebarArchiveProtected(e.task.id)?e=>l(["]
];

const linux10954ArchiveRuntime = [
  ["var hWs,gWs,H6;function _Ws(){return(_Ws=n((()=>{hWs=Y(),G(),dt(),gWs=na(),", "var MTKarchiveReact,hWs,gWs,H6;function _Ws(){return(_Ws=n((()=>{hWs=Y(),G(),dt(),gWs=na(),MTKarchiveReact=gWs,"] ,
  ["function pWs(e){let t=(0,hWs.c)(171),", "function pWs(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(MTKarchiveReact),t=(0,hWs.c)(173),"],
  ["let vt=la(_t),yt;t[83]!==S", "let vt=la(_t),yt;t[171]!==MTKsidebarArchiveEpoch||t[83]!==S"],
  ["t[100]=T,t[101]=yt):yt=t[101]", "t[100]=T,t[171]=MTKsidebarArchiveEpoch,t[101]=yt):yt=t[101]"],
  ["let bt=la(yt),xt=C&&S,St;t[102]!==n", "let bt=la(yt),xt=C&&S,St;t[172]!==MTKsidebarArchiveEpoch||t[102]!==n"],
  ["t[112]=xt,t[113]=St):St=t[113]", "t[112]=xt,t[172]=MTKsidebarArchiveEpoch,t[113]=St):St=t[113]"],
  ["function $qs(e){let t=(0,tJs.c)(89),", "function $qs(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(MTKarchiveReact),t=(0,tJs.c)(90),"],
  ["let rt;t[78]!==Ae", "let rt;t[89]!==MTKsidebarArchiveEpoch||t[78]!==Ae"],
  ["t[84]=R,t[85]=rt):rt=t[85]", "t[84]=R,t[89]=MTKsidebarArchiveEpoch,t[85]=rt):rt=t[85]"],
  ["function MYs(e){let t=(0,BYs.c)(181),", "function MYs(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(MTKarchiveReact),t=(0,BYs.c)(182),"],
  ["let vt=_t,yt;t[83]!==d", "let vt=_t,yt;t[181]!==MTKsidebarArchiveEpoch||t[83]!==d"],
  ["t[116]=k,t[117]=yt):yt=t[117]", "t[116]=k,t[181]=MTKsidebarArchiveEpoch,t[117]=yt):yt=t[117]"]
];

export const linuxBuild10954 = {
  app: {
    name: "26.917.71314-10954-linux",
    pristineSeam: "function Bzc(){let e=(0,Uzc.c)(12),t=Qr(X),",
    seam: "function Bzc(){MTKuseAgentRoster();let e=(0,Uzc.c)(12),t=Qr(X),",
    patchedSeam: "function Bzc(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,Uzc.c)(12),t=Qr(X),",
    agentRoster: true,
    helperReplacements: [["QSl.useEffect", "Wzc.useEffect"]],
    bottomFadeBefore: null,
    bottomFadeAfter: null
  },
  bottomFade: {
    file: "app-primary",
    before: '(0,S7.jsx)(`div`,{"aria-hidden":!0,className:`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-full bg-gradient-to-t from-surface via-surface extension:from-surface-secondary extension:via-surface-secondary`})',
    after: '(0,S7.jsx)(`div`,{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-full bg-gradient-to-t from-surface via-surface extension:from-surface-secondary extension:via-surface-secondary`})'
  },
  local: {
    name: "26.917.71314-10954-linux",
    cacheBefore: "function hl(e){let t=(0,Sl.c)(98),",
    cacheAfter: "function hl(e){let t=(0,Sl.c)(99),",
    rootBefore: 't[78]!==ne||t[79]!==re||t[80]!==ie||t[81]!==ae||t[82]!==se||t[83]!==ce||t[84]!==le||t[85]!==ue||t[86]!==de||t[87]!==fe||t[88]!==pe||t[89]!==me?(he=(0,Q.jsxs)(`div`,{ref:N,className:`relative h-full min-h-0`,children:[ne,re,ie,ae,oe,se,ce,le,ue,de,fe,pe,me]}),t[78]=ne,t[79]=re,t[80]=ie,t[81]=ae,t[82]=se,t[83]=ce,t[84]=le,t[85]=ue,t[86]=de,t[87]=fe,t[88]=pe,t[89]=me,t[90]=he):he=t[90];',
    rootAfter: 't[78]!==ne||t[79]!==re||t[80]!==ie||t[81]!==ae||t[82]!==se||t[83]!==ce||t[84]!==le||t[85]!==ue||t[86]!==de||t[87]!==fe||t[88]!==pe||t[89]!==me||t[98]!==r?(he=(0,Q.jsxs)(`div`,{ref:N,"data-mtk-palette-room-host":!0,"data-mtk-palette-thread-id":r,className:`relative h-full min-h-0`,children:[ne,re,ie,ae,oe,se,ce,le,ue,de,fe,pe,me]}),t[78]=ne,t[79]=re,t[80]=ie,t[81]=ae,t[82]=se,t[83]=ce,t[84]=le,t[85]=ue,t[86]=de,t[87]=fe,t[88]=pe,t[89]=me,t[98]=r,t[90]=he):he=t[90];'
  },
  archive: {
    pristine: linux10954ArchiveBehavior.map(([before]) => before),
    applied: linux10954ArchiveBehavior.map(([, after]) => after),
    replacements: linux10954ArchiveBehavior,
    runtimePristine: linux10954ArchiveRuntime.map(([before]) => before),
    runtimeApplied: linux10954ArchiveRuntime.map(([, after]) => after),
    runtimeReplacements: linux10954ArchiveRuntime
  }
};

export const linuxBuild9771 = {
  app: {
    name: "26.915.31029-9771-linux",
    pristineSeam: "function xyl(){let e=(0,wyl.c)(12),t=xf($),",
    seam: "function xyl(){MTKuseAgentRoster();let e=(0,wyl.c)(12),t=xf($),",
    patchedSeam: "function xyl(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,wyl.c)(12),t=xf($),",
    agentRoster: true,
    helperReplacements: [["QSl.useEffect", "Tyl.useEffect"]],
    bottomFadeBefore: null,
    bottomFadeAfter: null
  },
  bottomFade: {
    file: "app-primary",
    before: '(0,C7.jsx)(`div`,{"aria-hidden":!0,className:`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-full bg-gradient-to-t from-surface via-surface extension:from-surface-secondary extension:via-surface-secondary`})',
    after: '(0,C7.jsx)(`div`,{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-full bg-gradient-to-t from-surface via-surface extension:from-surface-secondary extension:via-surface-secondary`})'
  },
  local: {
    name: "26.915.31029-9771-linux",
    cacheBefore: "function pl(e){let t=(0,bl.c)(99),",
    cacheAfter: "function pl(e){let t=(0,bl.c)(100),",
    rootBefore: 't[79]!==q||t[80]!==ne||t[81]!==re||t[82]!==ie||t[83]!==oe||t[84]!==se||t[85]!==ce||t[86]!==le||t[87]!==ue||t[88]!==de||t[89]!==fe||t[90]!==pe?(me=(0,Q.jsxs)(`div`,{ref:N,className:`relative h-full min-h-0`,children:[q,ne,re,ie,ae,oe,se,ce,le,ue,de,fe,pe]}),t[79]=q,t[80]=ne,t[81]=re,t[82]=ie,t[83]=oe,t[84]=se,t[85]=ce,t[86]=le,t[87]=ue,t[88]=de,t[89]=fe,t[90]=pe,t[91]=me):me=t[91];',
    rootAfter: 't[79]!==q||t[80]!==ne||t[81]!==re||t[82]!==ie||t[83]!==oe||t[84]!==se||t[85]!==ce||t[86]!==le||t[87]!==ue||t[88]!==de||t[89]!==fe||t[90]!==pe||t[99]!==r?(me=(0,Q.jsxs)(`div`,{ref:N,"data-mtk-palette-room-host":!0,"data-mtk-palette-thread-id":r,className:`relative h-full min-h-0`,children:[q,ne,re,ie,ae,oe,se,ce,le,ue,de,fe,pe]}),t[79]=q,t[80]=ne,t[81]=re,t[82]=ie,t[83]=oe,t[84]=se,t[85]=ce,t[86]=le,t[87]=ue,t[88]=de,t[89]=fe,t[90]=pe,t[99]=r,t[91]=me):me=t[91];'
  },
  archiveRuntime: {
    owner: [
      "var Xwc,Zwc,Y8,Qwc;function $wc(){return($wc=n((()=>{Xwc=q(),$i(),Q(),Wr(),Zwc=W(),",
      "var MTKarchiveReact,Xwc,Zwc,Y8,Qwc;function $wc(){return($wc=n((()=>{Xwc=q(),$i(),Q(),Wr(),Zwc=W(),MTKarchiveReact=Zwc,"
    ],
    localMemo: "pt"
  }
};

export const linuxBuild9647 = {
  app: {
    name: "26.911.61220-9647-linux",
    pristineSeam: "function PYs(){let e=(0,LYs.c)(12),t=tm(Q),",
    seam: "function PYs(){MTKuseAgentRoster();let e=(0,LYs.c)(12),t=tm(Q),",
    patchedSeam: "function PYs(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,LYs.c)(12),t=tm(Q),",
    agentRoster: true,
    helperReplacements: [["QSl.useEffect", "RYs.useEffect"]],
    bottomFadeBefore: null,
    bottomFadeAfter: null
  },
  local: {
    name: "26.911.61220-9647-linux",
    cacheBefore: "function hu(e){let t=(0,Su.c)(91),",
    cacheAfter: "function hu(e){let t=(0,Su.c)(92),",
    rootBefore: 't[75]!==ne||t[76]!==re||t[77]!==ie||t[78]!==ae||t[79]!==se||t[80]!==ce||t[81]!==le||t[82]!==ue||t[83]!==de||t[84]!==fe||t[85]!==pe||t[86]!==me?(he=(0,Q.jsxs)(`div`,{ref:P,className:`relative h-full min-h-0`,children:[ne,re,ie,ae,oe,se,ce,le,ue,de,fe,pe,me]}),t[75]=ne,t[76]=re,t[77]=ie,t[78]=ae,t[79]=se,t[80]=ce,t[81]=le,t[82]=ue,t[83]=de,t[84]=fe,t[85]=pe,t[86]=me,t[87]=he):he=t[87];',
    rootAfter: 't[75]!==ne||t[76]!==re||t[77]!==ie||t[78]!==ae||t[79]!==se||t[80]!==ce||t[81]!==le||t[82]!==ue||t[83]!==de||t[84]!==fe||t[85]!==pe||t[86]!==me||t[91]!==r?(he=(0,Q.jsxs)(`div`,{ref:P,"data-mtk-palette-room-host":!0,"data-mtk-palette-thread-id":r,className:`relative h-full min-h-0`,children:[ne,re,ie,ae,oe,se,ce,le,ue,de,fe,pe,me]}),t[75]=ne,t[76]=re,t[77]=ie,t[78]=ae,t[79]=se,t[80]=ce,t[81]=le,t[82]=ue,t[83]=de,t[84]=fe,t[85]=pe,t[86]=me,t[91]=r,t[87]=he):he=t[87];'
  },
  archive: {
    runtime: {
      contextResult: "Xe",
      inlineDeclaration: "let Ze=sD(Xe),Qe=S&&x,$e",
      inlinePin: "Qe",
      inlineResult: "$e"
    },
    applied: [
      "globalThis.__MTKsidebarArchiveProtected=MTKsidebarArchiveProtected",
      "archive:D||MTKsidebarArchiveProtected(_)?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}",
      "function Akn({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i,archiveProtected:a}){return a&&(e=e.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`)),r.length<2?e:",
      "archiveProtected:fwn(T,r).some(e=>{let t=T.get(iS,e),n=t?.kind===`local`?t.conversationId:t?.kind===`remote`?t.task.id:null;return MTKsidebarArchiveProtected(n)})",
      "archiveProtected:fwn(K,e).some(e=>{let t=K.get(iS,e),n=t?.kind===`local`?t.conversationId:t?.kind===`remote`?t.task.id:null;return MTKsidebarArchiveProtected(n)})",
      "archive:MTKsidebarArchiveProtected(n)?null:t!=null&&(De||V)?Ne:t",
      "Be=xe&&!MTKsidebarArchiveProtected(ae)?Ae:null",
      "if(xe&&!MTKsidebarArchiveProtected(ae)&&e.push({id:`archive-task`",
      "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:q&&!MTKsidebarArchiveProtected(e.task.id)?e=>d(["
    ],
    pristine: [
      "archive:D?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}",
      "function Akn({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i}){return r.length<2?e:",
      "selectedThreadKeys:fwn(T,r),threadKey:r})",
      "selectedThreadKeys:fwn(K,e),threadKey:e})",
      "archive:t!=null&&(De||V)?Ne:t",
      "Be=xe?Ae:null",
      "if(xe&&e.push({id:`archive-task`",
      "archive:n,getMenuItems:q?e=>d(["
    ],
    replacements: [
      [
        "function mkn({scope:e,target:t,actions:n,onRename:r,onArchive:i,",
        "const MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function mkn({scope:e,target:t,actions:n,onRename:r,onArchive:i,",
        "Linux build-9647 archive classifier bridge"
      ],
      [
        "archive:D?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}",
        "archive:D||MTKsidebarArchiveProtected(_)?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}",
        "Linux build-9647 local context archive item"
      ],
      [
        "function Akn({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i}){return r.length<2?e:",
        "function Akn({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i,archiveProtected:a}){return a&&(e=e.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`)),r.length<2?e:",
        "Linux build-9647 bulk archive filter"
      ],
      [
        "selectedThreadKeys:fwn(T,r),threadKey:r})",
        "selectedThreadKeys:fwn(T,r),threadKey:r,archiveProtected:fwn(T,r).some(e=>{let t=T.get(iS,e),n=t?.kind===`local`?t.conversationId:t?.kind===`remote`?t.task.id:null;return MTKsidebarArchiveProtected(n)})})",
        "Linux build-9647 local protected selection"
      ],
      [
        "selectedThreadKeys:fwn(K,e),threadKey:e})",
        "selectedThreadKeys:fwn(K,e),threadKey:e,archiveProtected:fwn(K,e).some(e=>{let t=K.get(iS,e),n=t?.kind===`local`?t.conversationId:t?.kind===`remote`?t.task.id:null;return MTKsidebarArchiveProtected(n)})})",
        "Linux build-9647 unified protected selection"
      ],
      [
        "archive:t!=null&&(De||V)?Ne:t,getMenuItems:",
        "archive:MTKsidebarArchiveProtected(n)?null:t!=null&&(De||V)?Ne:t,getMenuItems:",
        "Linux build-9647 local inline archive"
      ],
      ["Be=xe?Ae:null", "Be=xe&&!MTKsidebarArchiveProtected(ae)?Ae:null", "Linux build-9647 cloud inline archive"],
      [
        "if(xe&&e.push({id:`archive-task`",
        "if(xe&&!MTKsidebarArchiveProtected(ae)&&e.push({id:`archive-task`",
        "Linux build-9647 cloud context archive item"
      ],
      [
        "archive:n,getMenuItems:q?e=>d([",
        "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:q&&!MTKsidebarArchiveProtected(e.task.id)?e=>d([",
        "Linux build-9647 remote row archive"
      ]
    ]
  }
};
