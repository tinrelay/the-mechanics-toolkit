export const build12404 = {
  dynamic: {
    owner: "function aS(",
    before: "function aS(e){let t=(0,oS.c)(17),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(ct(!o.completed&&n!=null?Ka:`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=Zh(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c)}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
    after: "function aS(e){let t=(0,oS.c)(19),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s,sourceTurnId:h,ReceiptLifecycle:g}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(ct(!o.completed&&n!=null?Ka:`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l||t[17]!==h||t[18]!==g){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=Zh(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c,{conversationId:n,turnId:h,ReceiptLifecycle:g})}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[17]=h,t[18]=g,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
    call: "(e=(0,$.jsx)(aS,{agentActivityIcon:tt,conversationId:p,enableTimelineTargets:Pe,item:n}),t[401]=tt,t[402]=p,t[403]=Pe,t[404]=n,t[405]=e)",
    parentBefore: "function vD(e){let t=(0,kD.c)(418),",
    parentAfter: "function vD(e){let t=(0,kD.c)(419),",
    parentTurn: "turnId:T,",
    callDependencyBefore: "t[404]!==n?",
    callDependencyAfter: "t[404]!==n||t[418]!==T?",
    callBodyBefore: "enableTimelineTargets:Pe,item:n}",
    callBodyAfter: "enableTimelineTargets:Pe,item:n,ReceiptLifecycle:MTKOutboundReceiptLifecycle,sourceTurnId:T}",
    callStorageBefore: "t[404]=n,t[405]=e",
    callStorageAfter: "t[404]=n,t[418]=T,t[405]=e",
    helperBoundary: "function aS(",
    react: "Fo()",
    jsx: "$"
  },
  turn: {
    owner: "function Lc(e){let t=(0,pl.c)(229),",
    marker: "turnId:h,",
    conversationId: "d",
    turnId: "h",
    boundary: "let qa=za.length,Ya={",
    register: "Ba",
    jsx: "$"
  }
};
