export const build22943 = {
  "app": {
    "name": "26.1027.30824-22943",
    "pristineSeam": "function PK(){let e=(0,RK.c)(12),t=G(U),",
    "seam": "function PK(){MTKuseAgentRoster();let e=(0,RK.c)(12),t=G(U),",
    "patchedSeam": "function PK(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,RK.c)(12),t=G(U),",
    "agentRoster": true,
    "helperReplacements": [
      [
        "QSl.useEffect",
        "BK.useEffect"
      ]
    ]
  },
  "local": {
    "name": "26.1027.30824-22943",
    "cacheBefore": "function Fl(e){let t=(0,Hl.c)(100),",
    "cacheAfter": "function Fl(e){let t=(0,Hl.c)(102),",
    "rootBefore": "t[84]!==I||t[85]!==fe||t[86]!==q||t[87]!==pe||t[88]!==he||t[89]!==ge||t[90]!==_e||t[91]!==ve||t[92]!==ye||t[93]!==Se||t[94]!==Ce||t[95]!==we?(Ee=(0,Q.jsxs)(`div`,{ref:I,className:`relative h-full min-h-0`,children:[fe,q,pe,he,ge,_e,ve,ye,Se,Ce,we]}),t[84]=I,t[85]=fe,t[86]=q,t[87]=pe,t[88]=he,t[89]=ge,t[90]=_e,t[91]=ve,t[92]=ye,t[93]=Se,t[94]=Ce,t[95]=we,t[96]=Ee):Ee=t[96];",
    "rootAfter": "t[84]!==I||t[85]!==fe||t[86]!==q||t[87]!==pe||t[88]!==he||t[89]!==ge||t[90]!==_e||t[91]!==ve||t[92]!==ye||t[93]!==Se||t[94]!==Ce||t[95]!==we||t[100]!==r||t[101]!==f?(Ee=(0,Q.jsxs)(`div`,{ref:I,\"data-mtk-palette-room-host\":!0,\"data-mtk-palette-thread-id\":r??f,className:`relative h-full min-h-0`,children:[fe,q,pe,he,ge,_e,ve,ye,Se,Ce,we]}),t[84]=I,t[85]=fe,t[86]=q,t[87]=pe,t[88]=he,t[89]=ge,t[90]=_e,t[91]=ve,t[92]=ye,t[93]=Se,t[94]=Ce,t[95]=we,t[100]=r,t[101]=f,t[96]=Ee):Ee=t[96];"
  },
  "bottomFade": {
    "file": "app-initial",
    "before": "(0,mB.jsx)(`div`,{\"aria-hidden\":!0,className:c})",
    "after": "(0,mB.jsx)(`div`,{\"aria-hidden\":!0,\"data-mtk-palette-bottom-fade\":!0,className:c})"
  },
  "delegation": {
    "owner": "function Lw(e){let t=(0,Rw.c)(14),",
    "replacements": [
      [
        "function Lw(e){let t=(0,Rw.c)(14),",
        "function Lw(e){let t=(0,Rw.c)(16),"
      ],
      [
        "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p?(h=(0,zw.jsx)(rx,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,alignment:`end`,accentColor:MTKdelegatedAccentColor}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[12]=h):h=t[12]",
        "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p||t[14]!==MTKtitle||t[15]!==r?(h=(0,zw.jsx)(rx,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,alignment:`end`,accentColor:MTKdelegatedAccentColor,paletteSourceTitle:MTKtitle,paletteSourceId:r}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[14]=MTKtitle,t[15]=r,t[12]=h):h=t[12]"
      ],
      [
        "function rx(e){let t=(0,ix.c)(21),",
        "function rx(e){let t=(0,ix.c)(23),"
      ],
      [
        "onLabelClick:d}=e,f=r===void 0?`end`:r,",
        "onLabelClick:d,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,f=r===void 0?`end`:r,"
      ],
      [
        "t[17]!==_||t[18]!==v||t[19]!==y?(b=(0,ax.jsxs)(`div`,{className:_,children:[v,y]}),t[17]=_,t[18]=v,t[19]=y,t[20]=b):b=t[20]",
        "t[17]!==_||t[18]!==v||t[19]!==y||t[21]!==MTKsourceTitle||t[22]!==MTKsourceId?(b=(0,ax.jsxs)(`div`,{\"data-mtk-palette-source-title\":MTKsourceTitle??void 0,\"data-mtk-palette-source-id\":MTKsourceId??void 0,className:_,children:[v,y]}),t[17]=_,t[18]=v,t[19]=y,t[21]=MTKsourceTitle,t[22]=MTKsourceId,t[20]=b):b=t[20]"
      ]
    ]
  },
  "archive": {
    "pristine": [
      "function oWn({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.length<2)return t;",
      "let k=O?wXe(e,_,v):{id:`archive-thread`,onSelect:a}",
      "archive:t!=null&&(ct||Ce)?mt:t,getMenuItems:",
      "Le?Ke:null",
      "if(Le&&e.push({id:`archive-task`",
      "archive:n,getMenuItems:ue?e=>f(["
    ],
    "applied": [
      "function oWn({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.some(t=>{let n=e.get(Ah,t);return MTKsidebarArchiveProtected(n?.kind===`local`?n.conversationId:n?.kind===`remote`?n.task.id:null)}))t=t.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`);if(i.length<2)return t;",
      "let k=MTKsidebarArchiveProtected(_)?null:O?wXe(e,_,v):{id:`archive-thread`,onSelect:a}",
      "archive:MTKsidebarArchiveProtected(r)?null:t!=null&&(ct||Ce)?mt:t,getMenuItems:",
      "Le&&!MTKsidebarArchiveProtected(ye)?Ke:null",
      "if(Le&&!MTKsidebarArchiveProtected(ye)&&e.push({id:`archive-task`",
      "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:ue&&!MTKsidebarArchiveProtected(e.task.id)?e=>f(["
    ],
    "replacements": [
      [
        "function oWn({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.length<2)return t;",
        "function oWn({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.some(t=>{let n=e.get(Ah,t);return MTKsidebarArchiveProtected(n?.kind===`local`?n.conversationId:n?.kind===`remote`?n.task.id:null)}))t=t.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`);if(i.length<2)return t;"
      ],
      [
        "let k=O?wXe(e,_,v):{id:`archive-thread`,onSelect:a}",
        "let k=MTKsidebarArchiveProtected(_)?null:O?wXe(e,_,v):{id:`archive-thread`,onSelect:a}"
      ],
      [
        "archive:t!=null&&(ct||Ce)?mt:t,getMenuItems:",
        "archive:MTKsidebarArchiveProtected(r)?null:t!=null&&(ct||Ce)?mt:t,getMenuItems:"
      ],
      [
        "Le?Ke:null",
        "Le&&!MTKsidebarArchiveProtected(ye)?Ke:null"
      ],
      [
        "if(Le&&e.push({id:`archive-task`",
        "if(Le&&!MTKsidebarArchiveProtected(ye)&&e.push({id:`archive-task`"
      ],
      [
        "archive:n,getMenuItems:ue?e=>f([",
        "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:ue&&!MTKsidebarArchiveProtected(e.task.id)?e=>f(["
      ]
    ],
    "runtimePristine": [
      "function oWn({scope:e,",
      "function VWn(e){let t=(0,bQ.c)(200),",
      "function qWn(e){let t=(0,YWn.c)(124),",
      "function jKn(e){let t=(0,NQ.c)(198),"
    ],
    "runtimeApplied": [
      "const MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function MTKuseSidebarArchivePolicy(){return lf().useSyncExternalStore(globalThis.__MTKsidebarArchiveSubscribe,globalThis.__MTKsidebarArchiveSnapshot,globalThis.__MTKsidebarArchiveSnapshot)}function oWn({scope:e,",
      "function VWn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,bQ.c)(201),MTKsidebarArchiveCache=t[200]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[200]=MTKsidebarArchiveEpoch),",
      "function qWn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,YWn.c)(125),MTKsidebarArchiveCache=t[124]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[124]=MTKsidebarArchiveEpoch),",
      "function jKn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,NQ.c)(199),MTKsidebarArchiveCache=t[198]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[198]=MTKsidebarArchiveEpoch),"
    ],
    "runtimeReplacements": [
      [
        "function oWn({scope:e,",
        "const MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function MTKuseSidebarArchivePolicy(){return lf().useSyncExternalStore(globalThis.__MTKsidebarArchiveSubscribe,globalThis.__MTKsidebarArchiveSnapshot,globalThis.__MTKsidebarArchiveSnapshot)}function oWn({scope:e,"
      ],
      [
        "function VWn(e){let t=(0,bQ.c)(200),",
        "function VWn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,bQ.c)(201),MTKsidebarArchiveCache=t[200]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[200]=MTKsidebarArchiveEpoch),"
      ],
      [
        "function qWn(e){let t=(0,YWn.c)(124),",
        "function qWn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,YWn.c)(125),MTKsidebarArchiveCache=t[124]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[124]=MTKsidebarArchiveEpoch),"
      ],
      [
        "function jKn(e){let t=(0,NQ.c)(198),",
        "function jKn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,NQ.c)(199),MTKsidebarArchiveCache=t[198]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[198]=MTKsidebarArchiveEpoch),"
      ]
    ]
  }
};
