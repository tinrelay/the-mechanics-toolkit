export const build21828 = {
  sharedModule: "./app-shared-2cae01273bae.js",
  dynamic: {
    owner: "function _w(",
    before: "function _w(e){let t=(0,vw.c)(17),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(Bn(!o.completed&&n!=null?Kl:`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=lm(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c)}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
    after: "function _w(e){let t=(0,vw.c)(19),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s,sourceTurnId:h,ReceiptLifecycle:g}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(Bn(!o.completed&&n!=null?Kl:`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l||t[17]!==h||t[18]!==g){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=lm(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c,{conversationId:n,turnId:h,ReceiptLifecycle:g})}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[17]=h,t[18]=g,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
    call: "(e=(0,$.jsx)(_w,{agentActivityIcon:et,conversationId:p,enableTimelineTargets:Ne,item:n}),t[412]=et,t[413]=p,t[414]=Ne,t[415]=n,t[416]=e)",
    parentBefore: "function hA(e){let t=(0,DA.c)(429),",
    parentAfter: "function hA(e){let t=(0,DA.c)(430),",
    parentTurn: "turnId:T,",
    callDependencyBefore: "t[415]!==n?",
    callDependencyAfter: "t[415]!==n||t[429]!==T?",
    callBodyBefore: "enableTimelineTargets:Ne,item:n}",
    callBodyAfter: "enableTimelineTargets:Ne,item:n,ReceiptLifecycle:MTKOutboundReceiptLifecycle,sourceTurnId:T}",
    callStorageBefore: "t[415]=n,t[416]=e",
    callStorageAfter: "t[415]=n,t[429]=T,t[416]=e",
    helperBoundary: "function _w(",
    react: "gt()",
    jsx: "$"
  },
  turn: {
    owner: "function rl(e){let t=(0,jl.c)(255),",
    marker: "turnId:m,",
    conversationId: "l",
    turnId: "m",
    boundary: "let Xa=Ja.length,Za={",
    register: "X",
    jsx: "$"
  }
};
