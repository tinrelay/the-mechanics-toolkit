export const build22530 = {
  "app": {
    "name": "26.1023.51421-22530",
    "pristineSeam": "function ZW(){let e=(0,tG.c)(12),t=R(q),",
    "seam": "function ZW(){MTKuseAgentRoster();let e=(0,tG.c)(12),t=R(q),",
    "patchedSeam": "function ZW(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,tG.c)(12),t=R(q),",
    "agentRoster": true,
    "helperReplacements": [
      [
        "QSl.useEffect",
        "rG.useEffect"
      ]
    ]
  },
  "local": {
    "name": "26.1023.51421-22530",
    "cacheBefore": "function Fl(e){let t=(0,Hl.c)(100),",
    "cacheAfter": "function Fl(e){let t=(0,Hl.c)(102),",
    "rootBefore": "t[84]!==z||t[85]!==fe||t[86]!==pe||t[87]!==me||t[88]!==ge||t[89]!==_e||t[90]!==ve||t[91]!==ye||t[92]!==be||t[93]!==xe||t[94]!==Ce||t[95]!==we?(Te=(0,Q.jsxs)(`div`,{ref:z,className:`relative h-full min-h-0`,children:[fe,pe,me,ge,_e,ve,ye,be,xe,Ce,we]}),t[84]=z,t[85]=fe,t[86]=pe,t[87]=me,t[88]=ge,t[89]=_e,t[90]=ve,t[91]=ye,t[92]=be,t[93]=xe,t[94]=Ce,t[95]=we,t[96]=Te):Te=t[96];",
    "rootAfter": "t[84]!==z||t[85]!==fe||t[86]!==pe||t[87]!==me||t[88]!==ge||t[89]!==_e||t[90]!==ve||t[91]!==ye||t[92]!==be||t[93]!==xe||t[94]!==Ce||t[95]!==we||t[100]!==r||t[101]!==f?(Te=(0,Q.jsxs)(`div`,{ref:z,\"data-mtk-palette-room-host\":!0,\"data-mtk-palette-thread-id\":r??f,className:`relative h-full min-h-0`,children:[fe,pe,me,ge,_e,ve,ye,be,xe,Ce,we]}),t[84]=z,t[85]=fe,t[86]=pe,t[87]=me,t[88]=ge,t[89]=_e,t[90]=ve,t[91]=ye,t[92]=be,t[93]=xe,t[94]=Ce,t[95]=we,t[100]=r,t[101]=f,t[96]=Te):Te=t[96];"
  },
  "bottomFade": {
    "file": "app-initial",
    "before": "(0,OH.jsx)(`div`,{\"aria-hidden\":!0,className:c})",
    "after": "(0,OH.jsx)(`div`,{\"aria-hidden\":!0,\"data-mtk-palette-bottom-fade\":!0,className:c})"
  },
  "delegation": {
    "owner": "function aw(e){let t=(0,ow.c)(14),",
    "replacements": [
      [
        "function aw(e){let t=(0,ow.c)(14),",
        "function aw(e){let t=(0,ow.c)(16),"
      ],
      [
        "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p?(h=(0,sw.jsx)(Eb,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,alignment:`end`,accentColor:MTKdelegatedAccentColor}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[12]=h):h=t[12]",
        "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p||t[14]!==MTKtitle||t[15]!==r?(h=(0,sw.jsx)(Eb,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,alignment:`end`,accentColor:MTKdelegatedAccentColor,paletteSourceTitle:MTKtitle,paletteSourceId:r}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[14]=MTKtitle,t[15]=r,t[12]=h):h=t[12]"
      ],
      [
        "function Eb(e){let t=(0,Db.c)(21),",
        "function Eb(e){let t=(0,Db.c)(23),"
      ],
      [
        "onLabelClick:d}=e,f=r===void 0?`end`:r,",
        "onLabelClick:d,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,f=r===void 0?`end`:r,"
      ],
      [
        "t[17]!==_||t[18]!==v||t[19]!==y?(b=(0,Ob.jsxs)(`div`,{className:_,children:[v,y]}),t[17]=_,t[18]=v,t[19]=y,t[20]=b):b=t[20]",
        "t[17]!==_||t[18]!==v||t[19]!==y||t[21]!==MTKsourceTitle||t[22]!==MTKsourceId?(b=(0,Ob.jsxs)(`div`,{\"data-mtk-palette-source-title\":MTKsourceTitle??void 0,\"data-mtk-palette-source-id\":MTKsourceId??void 0,className:_,children:[v,y]}),t[17]=_,t[18]=v,t[19]=y,t[21]=MTKsourceTitle,t[22]=MTKsourceId,t[20]=b):b=t[20]"
      ]
    ]
  },
  "archive": {
    "pristine": [
      "function $Yn({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.length<2)return t;",
      "let O=D?b0e(e,g,_):{id:`archive-thread`,onSelect:i}",
      "archive:t!=null&&(at||we)?dt:t,getMenuItems:",
      "Re?qe:null",
      "if(Re&&e.push({id:`archive-task`",
      "archive:n,getMenuItems:ue?e=>f(["
    ],
    "applied": [
      "function $Yn({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.some(t=>{let n=e.get(GS,t);return MTKsidebarArchiveProtected(n?.kind===`local`?n.conversationId:n?.kind===`remote`?n.task.id:null)}))t=t.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`);if(i.length<2)return t;",
      "let O=MTKsidebarArchiveProtected(g)?null:D?b0e(e,g,_):{id:`archive-thread`,onSelect:i}",
      "archive:MTKsidebarArchiveProtected(r)?null:t!=null&&(at||we)?dt:t,getMenuItems:",
      "Re&&!MTKsidebarArchiveProtected(be)?qe:null",
      "if(Re&&!MTKsidebarArchiveProtected(be)&&e.push({id:`archive-task`",
      "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:ue&&!MTKsidebarArchiveProtected(e.task.id)?e=>f(["
    ],
    "replacements": [
      [
        "function $Yn({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.length<2)return t;",
        "function $Yn({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.some(t=>{let n=e.get(GS,t);return MTKsidebarArchiveProtected(n?.kind===`local`?n.conversationId:n?.kind===`remote`?n.task.id:null)}))t=t.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`);if(i.length<2)return t;"
      ],
      [
        "let O=D?b0e(e,g,_):{id:`archive-thread`,onSelect:i}",
        "let O=MTKsidebarArchiveProtected(g)?null:D?b0e(e,g,_):{id:`archive-thread`,onSelect:i}"
      ],
      [
        "archive:t!=null&&(at||we)?dt:t,getMenuItems:",
        "archive:MTKsidebarArchiveProtected(r)?null:t!=null&&(at||we)?dt:t,getMenuItems:"
      ],
      [
        "Re?qe:null",
        "Re&&!MTKsidebarArchiveProtected(be)?qe:null"
      ],
      [
        "if(Re&&e.push({id:`archive-task`",
        "if(Re&&!MTKsidebarArchiveProtected(be)&&e.push({id:`archive-task`"
      ],
      [
        "archive:n,getMenuItems:ue?e=>f([",
        "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:ue&&!MTKsidebarArchiveProtected(e.task.id)?e=>f(["
      ]
    ],
    "runtimePristine": [
      "function $Yn({scope:e,",
      "function YXn(e){let t=(0,FX.c)(200),",
      "function tZn(e){let t=(0,rZn.c)(124),",
      "function IQn(e){let t=(0,JX.c)(198),"
    ],
    "runtimeApplied": [
      "const MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function MTKuseSidebarArchivePolicy(){return ha().useSyncExternalStore(globalThis.__MTKsidebarArchiveSubscribe,globalThis.__MTKsidebarArchiveSnapshot,globalThis.__MTKsidebarArchiveSnapshot)}function $Yn({scope:e,",
      "function YXn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,FX.c)(201),MTKsidebarArchiveCache=t[200]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[200]=MTKsidebarArchiveEpoch),",
      "function tZn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,rZn.c)(125),MTKsidebarArchiveCache=t[124]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[124]=MTKsidebarArchiveEpoch),",
      "function IQn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,JX.c)(199),MTKsidebarArchiveCache=t[198]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[198]=MTKsidebarArchiveEpoch),"
    ],
    "runtimeReplacements": [
      [
        "function $Yn({scope:e,",
        "const MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function MTKuseSidebarArchivePolicy(){return ha().useSyncExternalStore(globalThis.__MTKsidebarArchiveSubscribe,globalThis.__MTKsidebarArchiveSnapshot,globalThis.__MTKsidebarArchiveSnapshot)}function $Yn({scope:e,"
      ],
      [
        "function YXn(e){let t=(0,FX.c)(200),",
        "function YXn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,FX.c)(201),MTKsidebarArchiveCache=t[200]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[200]=MTKsidebarArchiveEpoch),"
      ],
      [
        "function tZn(e){let t=(0,rZn.c)(124),",
        "function tZn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,rZn.c)(125),MTKsidebarArchiveCache=t[124]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[124]=MTKsidebarArchiveEpoch),"
      ],
      [
        "function IQn(e){let t=(0,JX.c)(198),",
        "function IQn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,JX.c)(199),MTKsidebarArchiveCache=t[198]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[198]=MTKsidebarArchiveEpoch),"
      ]
    ]
  }
};
