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
