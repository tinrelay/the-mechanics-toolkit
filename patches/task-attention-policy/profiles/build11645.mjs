export const build11645 = {
  suffix: "11645",
  pristineAppRoot: "function _0a(){let e=(0,b0a.c)(12),t=Jl(Q),",
  appRootBefore: "function _0a(){MTKuseAgentRoster();MTKusePaletteBootstrap();",
  appRootAfter: "function _0a(){MTKuseAttentionBootstrap11645();MTKuseAgentRoster();MTKusePaletteBootstrap();",
  scopeAfter: "Jl(Q)",
  react: "x0a",
  decoder: "zd",
  localMatch: "null,n.threadId",
  remoteMatch: "null,n.taskId",
  atomFactoryContract: "yk=Vo(Q,0)",
  atomBefore: "gln=Oa(Q,({get:e})=>",
  atomAfter: "MTKattentionPolicyAtom=Vo(Q,0),gln=Oa(Q,({get:e})=>",
  dockBefore: "s=t===`work`?nve({cloudThreadsAllowed:i,localThreadsAllowed:vu(e(hh)),threadKeys:o}):o;return r+",
  dockAfter: "s=t===`work`?nve({cloudThreadsAllowed:i,localThreadsAllowed:vu(e(hh)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread11645(e,t)));return r+",
  notificationOwner: "function VJa(e,t){s.info(`[desktop-notifications] service starting`)",
  notificationBefore: "let a=CA(r),o=g(t.conversationId,r),c=",
  notificationAfter: "let a=CA(r);if(MTKattentionIgnored11645(a,t.conversationId)){s.debug(`[desktop-notifications] suppressed task-attention-policy turn-complete`,{safe:{conversationId:t.conversationId},sensitive:{}});return}let o=g(t.conversationId,r),c=",
  primaryOwner: "function O2i(e){let t=(0,A2i.c)(160),",
  primaryReact: "j2i",
  titleBefore: "let Xt=k2i({title:Ft,titleOverride:R})??Ze.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`}),Zt=",
  titleAfter: "let Xt=k2i({title:Ft,titleOverride:R})??Ze.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`}),MTKattentionIgnoredForTask=MTKuseTaskAttention11645(Xt,n),Zt=",
  pristinePrimary: [
    "Qt=Jt?!1:(pe??_t===!0)||Re&&(gt==null&&(vt??0)>0||Ct!=null||Be),$t=Jt||Re||gt!=null?0:vt??0",
    "hasUnreadTurn:!Jt&&_t===!0"
  ],
  patchedPrimary: [
    "Qt=MTKattentionIgnoredForTask?!1:Jt?!1:(pe??_t===!0)||Re&&(gt==null&&(vt??0)>0||Ct!=null||Be),$t=MTKattentionIgnoredForTask?0:Jt||Re||gt!=null?0:vt??0",
    "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Jt&&_t===!0"
  ],
  applied: {
    app: [
      "const MTKattentionRosterBridge=1",
      "MTKattentionPolicyAtom=Vo(Q,0)",
      "function MTKattentionIgnoredThread11645(",
      "function MTKattentionSubscribe11645(",
      "function MTKuseAttentionBootstrap11645(",
      "function _0a(){MTKuseAttentionBootstrap11645();MTKuseAgentRoster();MTKusePaletteBootstrap();",
      "s=s.filter(t=>!MTKattentionIgnoredThread11645(e,t))",
      "[desktop-notifications] suppressed task-attention-policy turn-complete"
    ],
    primary: [
      "function MTKuseTaskAttention11645(",
      "MTKattentionIgnoredForTask=MTKuseTaskAttention11645(Xt,n)",
      "Qt=MTKattentionIgnoredForTask?!1:Jt?!1:",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Jt&&_t===!0"
    ]
  }
};
