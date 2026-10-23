export const build21421 = {
  sharedModule: "./app-shared-fc3316d48427.js",
  dynamic: {
    owner: "function tC(",
    before: "function tC(e){let t=(0,nC.c)(17),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(Fn(!o.completed&&n!=null?la:`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=Ag(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c)}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
    after: "function tC(e){let t=(0,nC.c)(19),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s,sourceTurnId:h,ReceiptLifecycle:g}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(Fn(!o.completed&&n!=null?la:`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l||t[17]!==h||t[18]!==g){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=Ag(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c,{conversationId:n,turnId:h,ReceiptLifecycle:g})}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[17]=h,t[18]=g,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
    call: "(e=(0,$.jsx)(tC,{agentActivityIcon:$e,conversationId:p,enableTimelineTargets:Ne,item:n}),t[408]=$e,t[409]=p,t[410]=Ne,t[411]=n,t[412]=e)",
    parentBefore: "function SO(e){let t=(0,PO.c)(425),",
    parentAfter: "function SO(e){let t=(0,PO.c)(426),",
    parentTurn: "turnId:T,",
    callDependencyBefore: "t[411]!==n?",
    callDependencyAfter: "t[411]!==n||t[425]!==T?",
    callBodyBefore: "enableTimelineTargets:Ne,item:n}",
    callBodyAfter: "enableTimelineTargets:Ne,item:n,ReceiptLifecycle:MTKOutboundReceiptLifecycle,sourceTurnId:T}",
    callStorageBefore: "t[411]=n,t[412]=e",
    callStorageAfter: "t[411]=n,t[425]=T,t[412]=e",
    helperBoundary: "function tC(",
    react: "j()",
    jsx: "$"
  },
  turn: {
    owner: "function Bc(e){let t=(0,_l.c)(252),",
    marker: "turnId:p,",
    conversationId: "l",
    turnId: "p",
    boundary: "let ro=Qa.length,io={",
    register: "to",
    jsx: "$"
  }
};
