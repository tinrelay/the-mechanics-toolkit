export const build10789 = {
  hostBus: { module: "app-shared-", exported: "G3", constructor: "R" },
  persistentActivity: [
    "let ee=U,te;",
    "se=ee.length===0?null:(0,Yw.jsx)(_w,{...i,units:ee})",
    "let ce=se,le;",
    "children:[oe,ue,de,fe,ce,me]"
  ],
  taskImports: {
    appRoot: "function Bzc(){",
    taskOwner: "kF=ns(X,",
    storeHook: "jr",
    storeScope: "X",
    sharedModule: "./app-shared-70a4f71efb70.js",
    sharedHookExport: "LX",
    sharedScopeExport: "ZI",
    taskAtom: "kF",
    threadSummaryAtom: "vE",
    threadSummaryOwner: "vE=eo(X,({hostId:e,conversationId:t},{get:n})=>n(fE,e)?.getThreadSummary(t)??null,",
    localThreadKey: "Hw",
    remoteThreadKey: "Uw"
  },
  dynamic: {
    owner: "function Lv(",
    before: "function Lv(e){let t=(0,Rv.c)(17),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(p(`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=Vf(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c)}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
    after: "function Lv(e){let t=(0,Rv.c)(19),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s,sourceTurnId:h,ReceiptLifecycle:g}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(p(`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l||t[17]!==h||t[18]!==g){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=Vf(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c,{conversationId:n,turnId:h,ReceiptLifecycle:g})}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[17]=h,t[18]=g,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
    call: "(e=(0,$.jsx)(Lv,{agentActivityIcon:We,conversationId:f,enableTimelineTargets:Oe,item:n}),t[383]=We,t[384]=f,t[385]=Oe,t[386]=n,t[387]=e)",
    parentBefore: "function zC(e){let t=(0,tw.c)(400),",
    parentAfter: "function zC(e){let t=(0,tw.c)(401),",
    parentTurn: "turnId:T,",
    callDependencyBefore: "t[386]!==n?",
    callDependencyAfter: "t[386]!==n||t[400]!==T?",
    callBodyBefore: "enableTimelineTargets:Oe,item:n}",
    callBodyAfter: "enableTimelineTargets:Oe,item:n,ReceiptLifecycle:MTKOutboundReceiptLifecycle,sourceTurnId:T}",
    callStorageBefore: "t[386]=n,t[387]=e",
    callStorageAfter: "t[386]=n,t[400]=T,t[387]=e",
    helperBoundary: "function Lv(",
    react: "Ze()",
    jsx: "$"
  },
  turn: {
    owner: "function rl(e){let t=(0,kl.c)(189),",
    marker: "turnId:m,",
    conversationId: "c",
    turnId: "m",
    boundary: "let ea=Xi.length,ta={",
    register: "Zi",
    jsx: "$"
  }
};
