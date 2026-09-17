export const linuxBuild9647 = {
  taskImports: {
    appRoot: "function PYs(){",
    taskOwner: "AH=Vp(Q,",
    storeHook: "tm",
    storeScope: "Q",
    taskAtom: "AH",
    localThreadKey: "jj",
    remoteThreadKey: "Mj",
    titleAtom: "GEn",
    titleOwner: "GEn=ip(Rg,(e,{get:t})=>{",
    titleHelper: "UEn({...n,localTitle:r})"
  },
  dynamic: {
    owner: "function QS(",
    before: "function QS(e){let t=(0,$S.c)(17),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(uc(`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=bh(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c)}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
    after: "function QS(e){let t=(0,$S.c)(18),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s,sourceTurnId:h}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(uc(`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l||t[17]!==h){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=bh(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c,{conversationId:n,turnId:h})}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[17]=h,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
    call: "(e=(0,$.jsx)(QS,{agentActivityIcon:Ke,conversationId:f,enableTimelineTargets:ke,item:n}),t[375]=Ke,t[376]=f,t[377]=ke,t[378]=n,t[379]=e)",
    parentBefore: "function cO(e){let t=(0,wO.c)(392),",
    parentAfter: "function cO(e){let t=(0,wO.c)(393),",
    parentTurn: "turnId:w,",
    callDependencyBefore: "t[378]!==n?",
    callDependencyAfter: "t[378]!==n||t[392]!==w?",
    callBodyBefore: "enableTimelineTargets:ke,item:n}",
    callBodyAfter: "enableTimelineTargets:ke,item:n,ReceiptLifecycle:MTKOutboundReceiptLifecycle,sourceTurnId:w}",
    callStorageBefore: "t[378]=n,t[379]=e",
    callStorageAfter: "t[378]=n,t[392]=w,t[379]=e",
    helperBoundary: "function QS(",
    react: "t(r(),1)",
    jsx: "$"
  },
  persistentActivity: [
    "let U=H,W;",
    "ae=U.length===0?null:(0,yk.jsx)(BO,{...i,units:U})",
    "let oe=ae,se;",
    "children:[ie,le,ue,de,oe,pe]"
  ],
  turn: {
    owner: "function Z(e){let t=(0,Ba.c)(182),",
    marker: "turnId:p,",
    conversationId: "l",
    turnId: "p",
    boundary: "let to=Qa.length,no={"
  }
};
