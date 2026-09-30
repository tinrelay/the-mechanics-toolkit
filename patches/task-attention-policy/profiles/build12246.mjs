export const build12246 = {
  suffix: "12246",
  pristineAppRoot: "function u6s(){let e=(0,p6s.c)(12),t=Pe(Z),",
  appRootBefore: "function u6s(){MTKuseAgentRoster();MTKusePaletteBootstrap();",
  appRootAfter: "function u6s(){MTKuseAttentionBootstrap12246();MTKuseAgentRoster();MTKusePaletteBootstrap();",
  scopeAfter: "Pe(Z)",
  react: "m6s",
  decoder: "ls",
  localMatch: "null,n.threadId",
  remoteMatch: "null,n.taskId",
  atomFactoryContract: "HOn=Kp(Z,0)",
  atomBefore: "CQs=ld(Z,({get:e})=>",
  atomAfter: "MTKattentionPolicyAtom=Kp(Z,0),CQs=ld(Z,({get:e})=>",
  dockBefore: "s=t===`work`?Aae({cloudThreadsAllowed:i,localThreadsAllowed:Ii(e(ap)),threadKeys:o}):o;return r+",
  dockAfter: "s=t===`work`?Aae({cloudThreadsAllowed:i,localThreadsAllowed:Ii(e(ap)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread12246(e,t)));return r+",
  notificationOwner: "function YQs(e,t){Bg.info(`[desktop-notifications] service starting`)",
  notificationBefore: "(t,r)=>{if(f(t,r)){Bg.debug(`[desktop-notifications] suppressed turn-complete`",
  notificationAfter: "(t,r)=>{if(MTKattentionIgnored12246(Twe(r),t.conversationId)){Bg.debug(`[desktop-notifications] suppressed task-attention-policy turn-complete`,{safe:{conversationId:t.conversationId},sensitive:{}});return}if(f(t,r)){Bg.debug(`[desktop-notifications] suppressed turn-complete`",
  primaryOwner: "function Tvo(e){let t=(0,Dvo.c)(172),",
  primaryReact: "Ovo",
  titleBefore: "let Zt=Evo({title:It,titleOverride:z})??$e.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`}),Qt=",
  titleAfter: "let Zt=Evo({title:It,titleOverride:z})??$e.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`}),MTKattentionIgnoredForTask=MTKuseTaskAttention12246(Zt,n),Qt=",
  pristinePrimary: [
    "$t=Yt?!1:(me??vt===!0)||ze&&(_t==null&&(yt??0)>0||wt!=null||Ve),en=Yt||ze||_t!=null?0:yt??0",
    "hasUnreadTurn:!Yt&&vt===!0"
  ],
  patchedPrimary: [
    "$t=MTKattentionIgnoredForTask?!1:Yt?!1:(me??vt===!0)||ze&&(_t==null&&(yt??0)>0||wt!=null||Ve),en=MTKattentionIgnoredForTask?0:Yt||ze||_t!=null?0:yt??0",
    "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Yt&&vt===!0"
  ],
  applied: {
    app: [
      "const MTKattentionRosterBridge=1",
      "MTKattentionPolicyAtom=Kp(Z,0)",
      "function MTKattentionIgnoredThread12246(",
      "function MTKattentionSubscribe12246(",
      "function MTKuseAttentionBootstrap12246(",
      "function u6s(){MTKuseAttentionBootstrap12246();MTKuseAgentRoster();MTKusePaletteBootstrap();",
      "s=s.filter(t=>!MTKattentionIgnoredThread12246(e,t))",
      "[desktop-notifications] suppressed task-attention-policy turn-complete"
    ],
    primary: [
      "function MTKuseTaskAttention12246(",
      "MTKattentionIgnoredForTask=MTKuseTaskAttention12246(Zt,n)",
      "$t=MTKattentionIgnoredForTask?!1:Yt?!1:",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Yt&&vt===!0"
    ]
  }
};
