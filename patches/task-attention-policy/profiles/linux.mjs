export const linuxBuild8881 = {
  suffix: "8881Linux",
  appRoot: "function Jcs(){",
  notificationOwner: "function n3o(e,t){s.info(`[desktop-notifications] service starting`)",
  notificationBefore: "let a=_L(e.getConversation(t.conversationId)),{navigationPath:o,navigateToNotification:c}=g(t.conversationId)",
  atomBefore: "xga,Sga=t((()=>{Z(),",
  atomAfter: "xga,Sga=t((()=>{Z(),MTKattentionPolicyAtom=vm(Q,0),",
  dockBefore: "s=t===`work`?vQn({cloudThreadsAllowed:i,localThreadsAllowed:ZA(e(yC)),threadKeys:o}):o;return r+",
  dockAfter: "s=t===`work`?vQn({cloudThreadsAllowed:i,localThreadsAllowed:ZA(e(yC)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread8881Linux(e,t,c)));return r+",
  taskAtom: ["e(KB,t)", "e(hV,t)"],
  primaryOwner: "function F4t(e){let t=(0,L4t.c)(146),",
  primaryReact: "N4t",
  titleBefore: "vt=X(G2t,{hostId:qe??`local`,threadId:n})??Ve?.title??null,yt=X(rf,n)??Ve?.threadSource",
  titleAfter: "vt=X(G2t,{hostId:qe??`local`,threadId:n})??Ve?.title??null,MTKattentionIgnoredForTask=MTKuseTaskAttention8881Linux(vt,n),yt=X(rf,n)??Ve?.threadSource",
  applied: {
    app: [
      "const MTKattentionRosterBridge=1",
      "MTKattentionPolicyAtom=vm(Q,0)",
      "function MTKattentionIgnoredThread8881Linux(",
      "function MTKattentionSubscribe8881Linux(",
      "function MTKuseAttentionBootstrap8881Linux(",
      "function Jcs(){MTKuseAttentionBootstrap8881Linux();",
      "s=s.filter(t=>!MTKattentionIgnoredThread8881Linux(e,t,c))",
      "[desktop-notifications] suppressed task-attention-policy turn-complete"
    ],
    primary: [
      "function MTKuseTaskAttention8881Linux(",
      "MTKattentionIgnoredForTask=MTKuseTaskAttention8881Linux(vt,n)",
      "let Rt=MTKattentionIgnoredForTask?{...Lt,unread:!1,unreadCount:0}:Lt",
      "Ht=MTKattentionIgnoredForTask?[]:Vt==null?[]:[Vt]",
      "let Jt=MTKattentionIgnoredForTask?void 0:qt",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!jt&&nt===!0"
    ]
  },
  pristinePrimary: [
    "):Lt=t[25];let Rt=Lt,zt;t[26]",
    "Ht=Vt==null?[]:[Vt]",
    "):qt=t[45];let Jt=qt,Yt;t[46]",
    "hasUnreadTurn:!jt&&nt===!0"
  ]
};
