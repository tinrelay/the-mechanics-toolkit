export const linuxBuild9771 = {
  suffix: "9771Linux",
  pristineAppRoot: "function xyl(){let e=(0,wyl.c)(12),",
  appRootBefore: "function xyl(){MTKuseAgentRoster();MTKusePaletteBootstrap();",
  appRootAfter: "function xyl(){MTKuseAttentionBootstrap9771Linux();MTKuseAgentRoster();MTKusePaletteBootstrap();",
  scopeAfter: "xf($)",
  react: "Tyl",
  decoder: "dT",
  localMatch: "null,n.threadId",
  remoteMatch: "null,n.taskId",
  atomFactoryContract: "function nf(e,t,n){let r=ef(`signal`,e,",
  atomBefore: "AOa=of($,({get:e})=>",
  atomAfter: "MTKattentionPolicyAtom=nf($,0),AOa=of($,({get:e})=>",
  dockBefore: "s=t===`work`?v$n({cloudThreadsAllowed:i,localThreadsAllowed:PT(e(cy)),threadKeys:o}):o;return r+",
  dockAfter: "s=t===`work`?v$n({cloudThreadsAllowed:i,localThreadsAllowed:PT(e(cy)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread9771Linux(e,t)));return r+",
  notificationOwner: "function rfl(e,t){Ir.info(`[desktop-notifications] service starting`)",
  notificationBefore: "let a=dYr(e.getConversation(t.conversationId)),{navigationPath:o,navigateToNotification:s}=h(t.conversationId)",
  notificationAfter: "let a=dYr(e.getConversation(t.conversationId));if(MTKattentionIgnored9771Linux(a,t.conversationId)){Ir.debug(`[desktop-notifications] suppressed task-attention-policy turn-complete`,{safe:{conversationId:t.conversationId},sensitive:{}});return}let{navigationPath:o,navigateToNotification:s}=h(t.conversationId)",
  primaryOwner: "function hbc(e){let t=(0,_bc.c)(148),",
  primaryReact: "vbc",
  titleBefore: "Tt=bf(uyc,{hostId:et??`local`,threadId:n})??Je?.title??null,Et=",
  titleAfter: "Tt=bf(uyc,{hostId:et??`local`,threadId:n})??Je?.title??null,MTKattentionIgnoredForTask=MTKuseTaskAttention9771Linux(Tt,n),Et=",
  pristinePrimary: [
    "):Wt=t[25];let Gt=Wt,Kt;t[26]",
    "Yt=Jt==null?[]:[Jt]",
    "):en=t[45];let tn=en,nn;t[46]",
    "hasUnreadTurn:!Rt&&lt===!0"
  ],
  patchedPrimary: [
    "):Wt=t[25];let Gt=MTKattentionIgnoredForTask?{...Wt,unread:!1,unreadCount:0}:Wt,Kt;t[26]",
    "Yt=MTKattentionIgnoredForTask?[]:Jt==null?[]:[Jt]",
    "):en=t[45];let tn=MTKattentionIgnoredForTask?void 0:en,nn;t[46]",
    "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Rt&&lt===!0"
  ],
  applied: {
    app: [
      "const MTKattentionRosterBridge=1",
      "MTKattentionPolicyAtom=nf($,0)",
      "function MTKattentionIgnoredThread9771Linux(",
      "function MTKattentionSubscribe9771Linux(",
      "function MTKuseAttentionBootstrap9771Linux(",
      "function xyl(){MTKuseAttentionBootstrap9771Linux();MTKuseAgentRoster();MTKusePaletteBootstrap();",
      "s=s.filter(t=>!MTKattentionIgnoredThread9771Linux(e,t))",
      "[desktop-notifications] suppressed task-attention-policy turn-complete"
    ],
    primary: [
      "function MTKuseTaskAttention9771Linux(",
      "MTKattentionIgnoredForTask=MTKuseTaskAttention9771Linux(Tt,n)",
      "let Gt=MTKattentionIgnoredForTask?{...Wt,unread:!1,unreadCount:0}:Wt",
      "Yt=MTKattentionIgnoredForTask?[]:Jt==null?[]:[Jt]",
      "let tn=MTKattentionIgnoredForTask?void 0:en",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Rt&&lt===!0"
    ]
  }
};

export const linuxBuild9647 = {
  suffix: "9647Linux",
  pristineAppRoot: "function PYs(){let e=(0,LYs.c)(12),",
  appRootBefore: "function PYs(){MTKuseAgentRoster();MTKusePaletteBootstrap();",
  appRootAfter: "function PYs(){MTKuseAttentionBootstrap9647Linux();MTKuseAgentRoster();MTKusePaletteBootstrap();",
  scopeAfter: "tm(Q)",
  react: "RYs",
  decoder: "Nj",
  localMatch: "null,n.conversationId??n.threadId",
  remoteMatch: "n.task?.title,n.task?.id",
  atomFactoryContract: "function Fp(e,t,n){let r=Np(`signal`,e,",
  atomBefore: "U3a,W3a=t((()=>{X(),dT(),WL(),$(),IO(),iNi(),m$(),uM(),FH(),Fj(),WH(),U3a=Y(Q,({get:e})=>",
  atomAfter: "U3a,W3a=t((()=>{X(),dT(),WL(),$(),IO(),iNi(),m$(),uM(),FH(),Fj(),WH(),MTKattentionPolicyAtom=Fp(Q,0),U3a=Y(Q,({get:e})=>",
  dockBefore: "s=t===`work`?Wxr({cloudThreadsAllowed:i,localThreadsAllowed:nM(e(aT)),threadKeys:o}):o;return r+",
  dockAfter: "s=t===`work`?Wxr({cloudThreadsAllowed:i,localThreadsAllowed:nM(e(aT)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread9647Linux(e,t)));return r+",
  notificationOwner: "function uHs(e,t){l.info(`[desktop-notifications] service starting`)",
  notificationBefore: "let a=VR(e.getConversation(t.conversationId)),{navigationPath:o,navigateToNotification:s}=g(t.conversationId)",
  notificationAfter: "let a=VR(e.getConversation(t.conversationId));if(MTKattentionIgnored9647Linux(a,t.conversationId)){l.debug(`[desktop-notifications] suppressed task-attention-policy turn-complete`,{safe:{conversationId:t.conversationId},sensitive:{}});return}let{navigationPath:o,navigateToNotification:s}=g(t.conversationId)",
  primaryOwner: "function FDn(e){let t=(0,LDn.c)(146),",
  primaryReact: "NDn",
  titleBefore: "gt=CC(GEn,{hostId:Ge??`local`,threadId:n})??ze?.title??null,_t=CC(qT,n)??ze?.threadSource",
  titleAfter: "gt=CC(GEn,{hostId:Ge??`local`,threadId:n})??ze?.title??null,MTKattentionIgnoredForTask=MTKuseTaskAttention9647Linux(gt,n),_t=CC(qT,n)??ze?.threadSource",
  pristinePrimary: [
    "):Ft=t[25];let It=Ft,Lt;t[26]",
    "Bt=zt==null?[]:[zt]",
    "):Gt=t[45];let Kt=Gt,qt;t[46]",
    "hasUnreadTurn:!kt&&et===!0"
  ],
  patchedPrimary: [
    "):Ft=t[25];let It=MTKattentionIgnoredForTask?{...Ft,unread:!1,unreadCount:0}:Ft,Lt;t[26]",
    "Bt=MTKattentionIgnoredForTask?[]:zt==null?[]:[zt]",
    "):Gt=t[45];let Kt=MTKattentionIgnoredForTask?void 0:Gt,qt;t[46]",
    "hasUnreadTurn:!MTKattentionIgnoredForTask&&!kt&&et===!0"
  ],
  applied: {
    app: [
      "const MTKattentionRosterBridge=1",
      "MTKattentionPolicyAtom=Fp(Q,0)",
      "function MTKattentionIgnoredThread9647Linux(",
      "function MTKattentionSubscribe9647Linux(",
      "function MTKuseAttentionBootstrap9647Linux(",
      "function PYs(){MTKuseAttentionBootstrap9647Linux();MTKuseAgentRoster();MTKusePaletteBootstrap();",
      "s=s.filter(t=>!MTKattentionIgnoredThread9647Linux(e,t))",
      "[desktop-notifications] suppressed task-attention-policy turn-complete"
    ],
    primary: [
      "function MTKuseTaskAttention9647Linux(",
      "MTKattentionIgnoredForTask=MTKuseTaskAttention9647Linux(gt,n)",
      "let It=MTKattentionIgnoredForTask?{...Ft,unread:!1,unreadCount:0}:Ft",
      "Bt=MTKattentionIgnoredForTask?[]:zt==null?[]:[zt]",
      "let Kt=MTKattentionIgnoredForTask?void 0:Gt",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!kt&&et===!0"
    ]
  }
};
