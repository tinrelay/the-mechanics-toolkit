export const build21828 = {
  "app": {
    "name": "26.1021.31345-21828",
    "pristineSeam": "function DW(){let e=(0,jW.c)(12),t=K(f),",
    "seam": "function DW(){MTKuseAgentRoster();let e=(0,jW.c)(12),t=K(f),",
    "patchedSeam": "function DW(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,jW.c)(12),t=K(f),",
    "agentRoster": true,
    "helperReplacements": [
      [
        "QSl.useEffect",
        "NW.useEffect"
      ]
    ]
  },
  "local": {
    "name": "26.1021.31345-21828",
    "cacheBefore": "function Nl(e){let t=(0,Bl.c)(100),",
    "cacheAfter": "function Nl(e){let t=(0,Bl.c)(102),",
    "rootBefore": "t[84]!==I||t[85]!==fe||t[86]!==pe||t[87]!==me||t[88]!==ge||t[89]!==_e||t[90]!==ve||t[91]!==ye||t[92]!==be||t[93]!==Y||t[94]!==xe||t[95]!==Se?(Ce=(0,Q.jsxs)(`div`,{ref:I,className:`relative h-full min-h-0`,children:[fe,pe,me,ge,_e,ve,ye,be,Y,xe,Se]}),t[84]=I,t[85]=fe,t[86]=pe,t[87]=me,t[88]=ge,t[89]=_e,t[90]=ve,t[91]=ye,t[92]=be,t[93]=Y,t[94]=xe,t[95]=Se,t[96]=Ce):Ce=t[96];",
    "rootAfter": "t[84]!==I||t[85]!==fe||t[86]!==pe||t[87]!==me||t[88]!==ge||t[89]!==_e||t[90]!==ve||t[91]!==ye||t[92]!==be||t[93]!==Y||t[94]!==xe||t[95]!==Se||t[100]!==r||t[101]!==f?(Ce=(0,Q.jsxs)(`div`,{ref:I,\"data-mtk-palette-room-host\":!0,\"data-mtk-palette-thread-id\":r??f,className:`relative h-full min-h-0`,children:[fe,pe,me,ge,_e,ve,ye,be,Y,xe,Se]}),t[84]=I,t[85]=fe,t[86]=pe,t[87]=me,t[88]=ge,t[89]=_e,t[90]=ve,t[91]=ye,t[92]=be,t[93]=Y,t[94]=xe,t[95]=Se,t[100]=r,t[101]=f,t[96]=Ce):Ce=t[96];"
  },
  "bottomFade": {
    "file": "app-initial",
    "before": "(0,XV.jsx)(`div`,{\"aria-hidden\":!0,className:s})",
    "after": "(0,XV.jsx)(`div`,{\"aria-hidden\":!0,\"data-mtk-palette-bottom-fade\":!0,className:s})"
  },
  "delegation": {
    "owner": "function YC(e){let t=(0,XC.c)(14),",
    "replacements": [
      [
        "function YC(e){let t=(0,XC.c)(14),",
        "function YC(e){let t=(0,XC.c)(16),"
      ],
      [
        "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p?(h=(0,ZC.jsx)(gb,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,alignment:`end`,accentColor:MTKdelegatedAccentColor}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[12]=h):h=t[12]",
        "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p||t[14]!==MTKtitle||t[15]!==r?(h=(0,ZC.jsx)(gb,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,alignment:`end`,accentColor:MTKdelegatedAccentColor,paletteSourceTitle:MTKtitle,paletteSourceId:r}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[14]=MTKtitle,t[15]=r,t[12]=h):h=t[12]"
      ],
      [
        "function gb(e){let t=(0,_b.c)(21),",
        "function gb(e){let t=(0,_b.c)(23),"
      ],
      [
        "onLabelClick:d}=e,f=r===void 0?`end`:r,",
        "onLabelClick:d,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,f=r===void 0?`end`:r,"
      ],
      [
        "t[17]!==_||t[18]!==v||t[19]!==y?(b=(0,vb.jsxs)(`div`,{className:_,children:[v,y]}),t[17]=_,t[18]=v,t[19]=y,t[20]=b):b=t[20]",
        "t[17]!==_||t[18]!==v||t[19]!==y||t[21]!==MTKsourceTitle||t[22]!==MTKsourceId?(b=(0,vb.jsxs)(`div`,{\"data-mtk-palette-source-title\":MTKsourceTitle??void 0,\"data-mtk-palette-source-id\":MTKsourceId??void 0,className:_,children:[v,y]}),t[17]=_,t[18]=v,t[19]=y,t[21]=MTKsourceTitle,t[22]=MTKsourceId,t[20]=b):b=t[20]"
      ]
    ]
  },
  "archive": {
    "pristine": [
      "function HXn({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.length<2)return t;",
      "let k=O?t_e(e,_,v):{id:`archive-thread`,onSelect:i}",
      "let L=[],R=[],z=D?[]:[k]",
      "archive:t!=null&&(dt||Ee)?_t:t,getMenuItems:",
      "gt=Fe?We:null",
      "if(Fe&&e.push({id:`archive-task`",
      "archive:n,getMenuItems:de?e=>f(["
    ],
    "applied": [
      "function HXn({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.some(t=>{let n=e.get(vw,t);return MTKsidebarArchiveProtected(n?.kind===`local`?n.conversationId:n?.kind===`remote`?n.task.id:null)}))t=t.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`);if(i.length<2)return t;",
      "let k=MTKsidebarArchiveProtected(_)?null:O?t_e(e,_,v):{id:`archive-thread`,onSelect:i}",
      "let L=[],R=[],z=D||k==null?[]:[k]",
      "archive:MTKsidebarArchiveProtected(r)?null:t!=null&&(dt||Ee)?_t:t,getMenuItems:",
      "gt=Fe&&!MTKsidebarArchiveProtected(_e)?We:null",
      "if(Fe&&!MTKsidebarArchiveProtected(_e)&&e.push({id:`archive-task`",
      "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:de&&!MTKsidebarArchiveProtected(e.task.id)?e=>f(["
    ],
    "replacements": [
      [
        "function HXn({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.length<2)return t;",
        "function HXn({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.some(t=>{let n=e.get(vw,t);return MTKsidebarArchiveProtected(n?.kind===`local`?n.conversationId:n?.kind===`remote`?n.task.id:null)}))t=t.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`);if(i.length<2)return t;"
      ],
      [
        "let k=O?t_e(e,_,v):{id:`archive-thread`,onSelect:i}",
        "let k=MTKsidebarArchiveProtected(_)?null:O?t_e(e,_,v):{id:`archive-thread`,onSelect:i}"
      ],
      [
        "let L=[],R=[],z=D?[]:[k]",
        "let L=[],R=[],z=D||k==null?[]:[k]"
      ],
      [
        "archive:t!=null&&(dt||Ee)?_t:t,getMenuItems:",
        "archive:MTKsidebarArchiveProtected(r)?null:t!=null&&(dt||Ee)?_t:t,getMenuItems:"
      ],
      [
        "gt=Fe?We:null",
        "gt=Fe&&!MTKsidebarArchiveProtected(_e)?We:null"
      ],
      [
        "if(Fe&&e.push({id:`archive-task`",
        "if(Fe&&!MTKsidebarArchiveProtected(_e)&&e.push({id:`archive-task`"
      ],
      [
        "archive:n,getMenuItems:de?e=>f([",
        "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:de&&!MTKsidebarArchiveProtected(e.task.id)?e=>f(["
      ]
    ],
    "runtimePristine": [
      "function HXn({scope:e,",
      "function RZn(e){let t=(0,HX.c)(201),",
      "function WZn(e){let t=(0,KZn.c)(121),",
      "function j$n(e){let t=(0,tZ.c)(199),"
    ],
    "runtimeApplied": [
      "const MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function MTKuseSidebarArchivePolicy(){return wc().useSyncExternalStore(globalThis.__MTKsidebarArchiveSubscribe,globalThis.__MTKsidebarArchiveSnapshot,globalThis.__MTKsidebarArchiveSnapshot)}function HXn({scope:e,",
      "function RZn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,HX.c)(202),MTKsidebarArchiveCache=t[201]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[201]=MTKsidebarArchiveEpoch),",
      "function WZn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,KZn.c)(122),MTKsidebarArchiveCache=t[121]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[121]=MTKsidebarArchiveEpoch),",
      "function j$n(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,tZ.c)(200),MTKsidebarArchiveCache=t[199]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[199]=MTKsidebarArchiveEpoch),"
    ],
    "runtimeReplacements": [
      [
        "function HXn({scope:e,",
        "const MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function MTKuseSidebarArchivePolicy(){return wc().useSyncExternalStore(globalThis.__MTKsidebarArchiveSubscribe,globalThis.__MTKsidebarArchiveSnapshot,globalThis.__MTKsidebarArchiveSnapshot)}function HXn({scope:e,"
      ],
      [
        "function RZn(e){let t=(0,HX.c)(201),",
        "function RZn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,HX.c)(202),MTKsidebarArchiveCache=t[201]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[201]=MTKsidebarArchiveEpoch),"
      ],
      [
        "function WZn(e){let t=(0,KZn.c)(121),",
        "function WZn(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,KZn.c)(122),MTKsidebarArchiveCache=t[121]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[121]=MTKsidebarArchiveEpoch),"
      ],
      [
        "function j$n(e){let t=(0,tZ.c)(199),",
        "function j$n(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,tZ.c)(200),MTKsidebarArchiveCache=t[199]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[199]=MTKsidebarArchiveEpoch),"
      ]
    ]
  }
};
