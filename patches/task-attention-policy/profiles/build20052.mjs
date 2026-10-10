export const build20052 = {
  suffix: "20052",
  pristineAppRoot: "function Xhc(){let e=(0,$hc.c)(12),t=Di(q),",
  appRootBefore: "function Xhc(){MTKuseAgentRoster();MTKusePaletteBootstrap();",
  appRootAfter: "function Xhc(){MTKuseAttentionBootstrap20052();MTKuseAgentRoster();MTKusePaletteBootstrap();",
  scopeAfter: "Di(q)",
  react: "egc",
  decoder: "wl",
  localMatch: "null,n.threadId",
  remoteMatch: "null,n.taskId",
  atomFactoryContract: "enr=fd(q,0)",
  atomBefore: "Bcc=Tu(q,({get:e})=>",
  atomAfter: "MTKattentionPolicyAtom=fd(q,0),Bcc=Tu(q,({get:e})=>",
  dockBefore: "s=t===`work`?tie({cloudThreadsAllowed:i,localThreadsAllowed:Js(e(Uc)),threadKeys:o}):o;return r+",
  dockAfter: "s=t===`work`?tie({cloudThreadsAllowed:i,localThreadsAllowed:Js(e(Uc)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread20052(e,t)));return r+",
  notificationOwner: "function clc(e,t){gr.info(`[desktop-notifications] service starting`)",
  notificationBefore: "(t,r)=>{if(f(t,r)){gr.debug(`[desktop-notifications] suppressed turn-complete`",
  notificationAfter: "(t,r)=>{if(MTKattentionIgnored20052(Wre(r),t.conversationId)){gr.debug(`[desktop-notifications] suppressed task-attention-policy turn-complete`,{safe:{conversationId:t.conversationId},sensitive:{}});return}if(f(t,r)){gr.debug(`[desktop-notifications] suppressed turn-complete`",
  primaryOwner: "function oqo(e){let t=(0,cqo.c)(181),",
  primaryReact: "lqo",
  titleBefore: "let Kt=sqo({title:jt,titleOverride:B})??$e.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`}),qt=",
  titleAfter: "let Kt=sqo({title:jt,titleOverride:B})??$e.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`}),MTKattentionIgnoredForTask=MTKuseTaskAttention20052(Kt,r),qt=",
  pristinePrimary: [
    "Jt=Wt?!1:(he??vt===!0)||ze&&(_t==null&&(yt??0)>0||wt!=null||Ve),Yt=Wt||ze||_t!=null?0:yt??0",
    "hasUnreadTurn:!Wt&&vt===!0"
  ],
  patchedPrimary: [
    "Jt=MTKattentionIgnoredForTask?!1:Wt?!1:(he??vt===!0)||ze&&(_t==null&&(yt??0)>0||wt!=null||Ve),Yt=MTKattentionIgnoredForTask?0:Wt||ze||_t!=null?0:yt??0",
    "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Wt&&vt===!0"
  ],
  applied: {
    app: [
      "const MTKattentionRosterBridge=1",
      "MTKattentionPolicyAtom=fd(q,0)",
      "function MTKattentionIgnoredThread20052(",
      "function MTKattentionSubscribe20052(",
      "function MTKuseAttentionBootstrap20052(",
      "function Xhc(){MTKuseAttentionBootstrap20052();MTKuseAgentRoster();MTKusePaletteBootstrap();",
      "s=s.filter(t=>!MTKattentionIgnoredThread20052(e,t))",
      "[desktop-notifications] suppressed task-attention-policy turn-complete"
    ],
    primary: [
      "function MTKuseTaskAttention20052(",
      "MTKattentionIgnoredForTask=MTKuseTaskAttention20052(Kt,r)",
      "Jt=MTKattentionIgnoredForTask?!1:Wt?!1:",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Wt&&vt===!0"
    ]
  }
};
