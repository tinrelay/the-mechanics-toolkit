export const build9922 = {
  hostBus: {
    module: "app-shared-",
    exported: "RB"
  },
  taskImports: {
    appRoot: "function Vvl(){",
    taskOwner: "JF=uf($,",
    storeHook: "xf",
    storeScope: "$",
    taskAtom: "JF",
    localThreadKey: "PT",
    remoteThreadKey: "FT"
  },
  persistentActivity: [
    "let U=H,W;",
    "ae=U.length===0?null:(0,RT.jsx)(oT,{...i,units:U})",
    "let oe=ae,se;",
    "children:[ie,le,ue,de,oe,pe]"
  ],
  dynamic: {
    owner: "function Ey(",
    before: "function Ey(e){let t=(0,Dy.c)(17),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(Lr(`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=Cp(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c)}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
    after: "function Ey(e){let t=(0,Dy.c)(19),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s,sourceTurnId:h,ReceiptLifecycle:g}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(Lr(`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l||t[17]!==h||t[18]!==g){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=Cp(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c,{conversationId:n,turnId:h,ReceiptLifecycle:g})}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[17]=h,t[18]=g,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
    call: "(e=(0,$.jsx)(Ey,{agentActivityIcon:Y,conversationId:f,enableTimelineTargets:De,item:n}),t[377]=Y,t[378]=f,t[379]=De,t[380]=n,t[381]=e)",
    parentBefore: "function Ow(e){let t=(0,Ww.c)(394),",
    parentAfter: "function Ow(e){let t=(0,Ww.c)(395),",
    parentTurn: "turnId:w,",
    callDependencyBefore: "t[380]!==n?",
    callDependencyAfter: "t[380]!==n||t[394]!==w?",
    callBodyBefore: "enableTimelineTargets:De,item:n}",
    callBodyAfter: "enableTimelineTargets:De,item:n,ReceiptLifecycle:MTKOutboundReceiptLifecycle,sourceTurnId:w}",
    callStorageBefore: "t[380]=n,t[381]=e",
    callStorageAfter: "t[380]=n,t[394]=w,t[381]=e",
    helperBoundary: "function Ey(",
    react: "ot()",
    jsx: "$"
  },
  turn: {
    owner: "function Uc(e){let t=(0,hl.c)(189),",
    marker: "turnId:h,",
    conversationId: "d",
    turnId: "h",
    boundary: "let ea=Xi.length,ta={",
    register: "Zi",
    jsx: "$"
  }
};
