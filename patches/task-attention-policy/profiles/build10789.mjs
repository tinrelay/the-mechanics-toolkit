export const build10789 = {
  suffix: "10789",
  pristineAppRoot: "function Bzc(){let e=(0,Uzc.c)(12),",
  appRootBefore: "function Bzc(){MTKuseAgentRoster();MTKusePaletteBootstrap();",
  appRootAfter: "function Bzc(){MTKuseAttentionBootstrap10789();MTKuseAgentRoster();MTKusePaletteBootstrap();",
  scopeBefore: "jr(X)",
  scopeAfter: "jr(X)",
  react: "Wzc",
  decoder: "Ww",
  localMatch: "null,n.threadId",
  remoteMatch: "null,n.taskId",
  atomFactoryContract: "QRn=Go(X,0)",
  atomBefore: "Foa=ls(X,({get:e})=>",
  atomAfter: "MTKattentionPolicyAtom=Go(X,0),Foa=ls(X,({get:e})=>",
  dockBefore: "s=t===`work`?CAn({cloudThreadsAllowed:i,localThreadsAllowed:_T(e(E_)),threadKeys:o}):o;return r+",
  dockAfter: "s=t===`work`?CAn({cloudThreadsAllowed:i,localThreadsAllowed:_T(e(E_)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread10789(e,t)));return r+",
  notificationOwner: "function lNc(e,t){Zr.info(`[desktop-notifications] service starting`)",
  notificationBefore: "let i=yOr(e.getConversation(t.conversationId)),{navigationPath:a,navigateToNotification:o}=h(t.conversationId)",
  notificationAfter: "let i=yOr(e.getConversation(t.conversationId));if(MTKattentionIgnored10789(i,t.conversationId)){Zr.debug(`[desktop-notifications] suppressed task-attention-policy turn-complete`,{safe:{conversationId:t.conversationId},sensitive:{}});return}let{navigationPath:a,navigateToNotification:o}=h(t.conversationId)",
  primaryOwner: "function CVs(e){let t=(0,TVs.c)(155),",
  primaryReact: "xVs",
  titleBefore: "Mt=He(yBs,{hostId:tt??`local`,threadId:n})??Xe?.title??null,Nt=",
  titleAfter: "Mt=He(yBs,{hostId:tt??`local`,threadId:n})??Xe?.title??null,MTKattentionIgnoredForTask=MTKuseTaskAttention10789(Mt,n),Nt=",
  pristinePrimary: [
    "let Qt=Zt,$t;",
    "hasUnreadTurn:!Gt&&mt===!0"
  ],
  patchedPrimary: [
    "let Qt=MTKattentionIgnoredForTask?{...Zt,unread:!1,unreadCount:0}:Zt,$t;",
    "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Gt&&mt===!0"
  ],
  applied: {
    app: [
      "const MTKattentionRosterBridge=1",
      "MTKattentionPolicyAtom=Go(X,0)",
      "function MTKattentionIgnoredThread10789(",
      "function MTKattentionSubscribe10789(",
      "function MTKuseAttentionBootstrap10789(",
      "function Bzc(){MTKuseAttentionBootstrap10789();MTKuseAgentRoster();MTKusePaletteBootstrap();",
      "s=s.filter(t=>!MTKattentionIgnoredThread10789(e,t))",
      "[desktop-notifications] suppressed task-attention-policy turn-complete"
    ],
    primary: [
      "function MTKuseTaskAttention10789(",
      "MTKattentionIgnoredForTask=MTKuseTaskAttention10789(Mt,n)",
      "let Qt=MTKattentionIgnoredForTask?{...Zt,unread:!1,unreadCount:0}:Zt",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Gt&&mt===!0"
    ]
  }
};
