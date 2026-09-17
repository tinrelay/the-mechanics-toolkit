export const linuxBuild9647 = {
  suffix: "9647Linux",
  appRoot: "function PYs(){",
  scope: ["nm(Q)", "tm(Q)"],
  notificationOwner: "function uHs(e,t){l.info(`[desktop-notifications] service starting`)",
  notificationBefore: "let a=VR(e.getConversation(t.conversationId)),{navigationPath:o,navigateToNotification:s}=g(t.conversationId)",
  atomFactoryContract: "function Fp(e,t,n){let r=Np(`signal`,e,",
  atomBefore: "U3a,W3a=t((()=>{X(),dT(),WL(),$(),IO(),iNi(),m$(),uM(),FH(),Fj(),WH(),U3a=Y(Q,({get:e})=>",
  atomAfter: "U3a,W3a=t((()=>{X(),dT(),WL(),$(),IO(),iNi(),m$(),uM(),FH(),Fj(),WH(),MTKattentionPolicyAtom=Fp(Q,0),U3a=Y(Q,({get:e})=>",
  dockBefore: "s=t===`work`?Wxr({cloudThreadsAllowed:i,localThreadsAllowed:nM(e(aT)),threadKeys:o}):o;return r+",
  dockAfter: "s=t===`work`?Wxr({cloudThreadsAllowed:i,localThreadsAllowed:nM(e(aT)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread9647Linux(e,t)));return r+",
  primaryOwner: "function FDn(e){let t=(0,LDn.c)(146),",
  primaryReact: "NDn",
  titleBefore: "gt=CC(GEn,{hostId:Ge??`local`,threadId:n})??ze?.title??null,_t=CC(qT,n)??ze?.threadSource",
  titleAfter: "gt=CC(GEn,{hostId:Ge??`local`,threadId:n})??ze?.title??null,MTKattentionIgnoredForTask=MTKuseTaskAttention9647Linux(gt,n),_t=CC(qT,n)??ze?.threadSource",
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
  },
  pristinePrimary: [
    "):Ft=t[25];let It=Ft,Lt;t[26]",
    "Bt=zt==null?[]:[zt]",
    "):Gt=t[45];let Kt=Gt,qt;t[46]",
    "hasUnreadTurn:!kt&&et===!0"
  ]
};
