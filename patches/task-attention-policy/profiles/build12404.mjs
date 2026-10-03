export const build12404 = {
  suffix: "12404",
  pristineAppRoot: "function O5s(){let e=(0,j5s.c)(12),t=Fe(Z),",
  appRootBefore: "function O5s(){MTKuseAgentRoster();MTKusePaletteBootstrap();",
  appRootAfter: "function O5s(){MTKuseAttentionBootstrap12404();MTKuseAgentRoster();MTKusePaletteBootstrap();",
  scopeAfter: "Fe(Z)",
  react: "M5s",
  decoder: "cs",
  localMatch: "null,n.threadId",
  remoteMatch: "null,n.taskId",
  atomFactoryContract: "GMn=Bp(Z,0)",
  atomBefore: "V1s=sd(Z,({get:e})=>",
  atomAfter: "MTKattentionPolicyAtom=Bp(Z,0),V1s=sd(Z,({get:e})=>",
  dockBefore: "s=t===`work`?Aae({cloudThreadsAllowed:i,localThreadsAllowed:Ii(e(Yf)),threadKeys:o}):o;return r+",
  dockAfter: "s=t===`work`?Aae({cloudThreadsAllowed:i,localThreadsAllowed:Ii(e(Yf)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread12404(e,t)));return r+",
  notificationOwner: "function p0s(e,t){Og.info(`[desktop-notifications] service starting`)",
  notificationBefore: "(t,r)=>{if(f(t,r)){Og.debug(`[desktop-notifications] suppressed turn-complete`",
  notificationAfter: "(t,r)=>{if(MTKattentionIgnored12404(Ewe(r),t.conversationId)){Og.debug(`[desktop-notifications] suppressed task-attention-policy turn-complete`,{safe:{conversationId:t.conversationId},sensitive:{}});return}if(f(t,r)){Og.debug(`[desktop-notifications] suppressed turn-complete`",
  primaryOwner: "function Txo(e){let t=(0,Dxo.c)(172),",
  primaryReact: "Oxo",
  titleBefore: "let Zt=Exo({title:It,titleOverride:z})??$e.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`}),Qt=",
  titleAfter: "let Zt=Exo({title:It,titleOverride:z})??$e.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`}),MTKattentionIgnoredForTask=MTKuseTaskAttention12404(Zt,n),Qt=",
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
      "MTKattentionPolicyAtom=Bp(Z,0)",
      "function MTKattentionIgnoredThread12404(",
      "function MTKattentionSubscribe12404(",
      "function MTKuseAttentionBootstrap12404(",
      "function O5s(){MTKuseAttentionBootstrap12404();MTKuseAgentRoster();MTKusePaletteBootstrap();",
      "s=s.filter(t=>!MTKattentionIgnoredThread12404(e,t))",
      "[desktop-notifications] suppressed task-attention-policy turn-complete"
    ],
    primary: [
      "function MTKuseTaskAttention12404(",
      "MTKattentionIgnoredForTask=MTKuseTaskAttention12404(Zt,n)",
      "$t=MTKattentionIgnoredForTask?!1:Yt?!1:",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Yt&&vt===!0"
    ]
  }
};
