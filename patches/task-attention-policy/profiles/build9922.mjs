export const build9922 = {
  suffix: "9922",
  pristineAppRoot: "function Vvl(){let e=(0,Wvl.c)(12),",
  appRootBefore: "function Vvl(){MTKuseAgentRoster();MTKusePaletteBootstrap();",
  appRootAfter: "function Vvl(){MTKuseAttentionBootstrap9922();MTKuseAgentRoster();MTKusePaletteBootstrap();",
  scopeBefore: "xf($)",
  scopeAfter: "xf($)",
  react: "Gvl",
  decoder: "IT",
  atomFactoryContract: "function rf(e,t,n){let r=tf(`signal`,e,",
  atomBefore: "fOa=sf($,({get:e})=>",
  atomAfter: "MTKattentionPolicyAtom=rf($,0),fOa=sf($,({get:e})=>",
  dockBefore: "s=t===`work`?qQn({cloudThreadsAllowed:i,localThreadsAllowed:aE(e(vy)),threadKeys:o}):o;return r+",
  dockAfter: "s=t===`work`?qQn({cloudThreadsAllowed:i,localThreadsAllowed:aE(e(vy)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread9922(e,t)));return r+",
  notificationOwner: "function rfl(e,t){$t.info(`[desktop-notifications] service starting`)",
  notificationBefore: "let a=uYr(e.getConversation(t.conversationId)),{navigationPath:o,navigateToNotification:s}=h(t.conversationId)",
  primaryOwner: "function hbc(e){let t=(0,_bc.c)(148),",
  primaryReact: "vbc",
  titleBefore: "Tt=bf(uyc,{hostId:et??`local`,threadId:n})??Je?.title??null,Et=",
  titleAfter: "Tt=bf(uyc,{hostId:et??`local`,threadId:n})??Je?.title??null,MTKattentionIgnoredForTask=MTKuseTaskAttention9922(Tt,n),Et=",
  pristinePrimary: [
    "):Wt=t[25];let Gt=Wt,Kt;t[26]",
    "Yt=Jt==null?[]:[Jt]",
    "):en=t[45];let tn=en,nn;t[46]",
    "hasUnreadTurn:!Rt&&lt===!0"
  ],
  applied: {
    app: [
      "const MTKattentionRosterBridge=1",
      "MTKattentionPolicyAtom=rf($,0)",
      "function MTKattentionIgnoredThread9922(",
      "function MTKattentionSubscribe9922(",
      "function MTKuseAttentionBootstrap9922(",
      "function Vvl(){MTKuseAttentionBootstrap9922();MTKuseAgentRoster();MTKusePaletteBootstrap();",
      "s=s.filter(t=>!MTKattentionIgnoredThread9922(e,t))",
      "[desktop-notifications] suppressed task-attention-policy turn-complete"
    ],
    primary: [
      "function MTKuseTaskAttention9922(",
      "MTKattentionIgnoredForTask=MTKuseTaskAttention9922(Tt,n)",
      "let Gt=MTKattentionIgnoredForTask?{...Wt,unread:!1,unreadCount:0}:Wt",
      "Yt=MTKattentionIgnoredForTask?[]:Jt==null?[]:[Jt]",
      "let tn=MTKattentionIgnoredForTask?void 0:en",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Rt&&lt===!0"
    ]
  }
};
