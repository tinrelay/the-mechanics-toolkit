export const build20052 = {
  dynamic: {
    owner: "function zS(",
    before: "function zS(e){let t=(0,BS.c)(17),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(un(!o.completed&&n!=null?Yo:`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=Cg(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c)}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
    after: "function zS(e){let t=(0,BS.c)(19),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s,sourceTurnId:h,ReceiptLifecycle:g}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(un(!o.completed&&n!=null?Yo:`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l||t[17]!==h||t[18]!==g){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=Cg(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c,{conversationId:n,turnId:h,ReceiptLifecycle:g})}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[17]=h,t[18]=g,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
    call: "(e=(0,$.jsx)(zS,{agentActivityIcon:rt,conversationId:f,enableTimelineTargets:Ie,item:n}),t[408]=rt,t[409]=f,t[410]=Ie,t[411]=n,t[412]=e)",
    parentBefore: "function nO(e){let t=(0,mO.c)(425),",
    parentAfter: "function nO(e){let t=(0,mO.c)(426),",
    parentTurn: "turnId:w,",
    callDependencyBefore: "t[411]!==n?",
    callDependencyAfter: "t[411]!==n||t[425]!==w?",
    callBodyBefore: "enableTimelineTargets:Ie,item:n}",
    callBodyAfter: "enableTimelineTargets:Ie,item:n,ReceiptLifecycle:MTKOutboundReceiptLifecycle,sourceTurnId:w}",
    callStorageBefore: "t[411]=n,t[412]=e",
    callStorageAfter: "t[411]=n,t[425]=w,t[412]=e",
    helperBoundary: "function zS(",
    react: "Rt()",
    jsx: "$"
  },
  turn: {
    owner: "function Lc(e){let t=(0,ml.c)(244),",
    marker: "turnId:g,",
    conversationId: "c",
    turnId: "g",
    boundary: "let $a=Ka.length,eo={",
    register: "X",
    jsx: "$"
  }
};
