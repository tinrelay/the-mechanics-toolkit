export const build22530 = {
  "suffix": "22530",
  "pristineAppRoot": "function ZW(){let e=(0,tG.c)(12),t=R(q),",
  "appRootBefore": "function ZW(){MTKuseAgentRoster();MTKusePaletteBootstrap();",
  "appRootAfter": "function ZW(){MTKuseAttentionBootstrap22530();MTKuseAgentRoster();MTKusePaletteBootstrap();",
  "scopeAfter": "R(q)",
  "react": "rG",
  "decoder": "MTKattentionDecode",
  "localMatch": "null,n.threadId",
  "remoteMatch": "null,n.taskId",
  "atomFactoryContract": "Tk=kt(q,!1)",
  "atomBefore": "LV=xn(q,({get:e})=>",
  "atomAfter": "MTKattentionPolicyAtom=kt(q,0),LV=xn(q,({get:e})=>",
  "dockBefore": "s=t===`work`?kd({cloudThreadsAllowed:i,localThreadsAllowed:cf(e(Ys)),threadKeys:o}):o;return r+",
  "dockAfter": "s=t===`work`?kd({cloudThreadsAllowed:i,localThreadsAllowed:cf(e(Ys)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread22530(e,t)));return r+",
  "notificationOwner": "function XV(e,t){G.info(`[desktop-notifications] service starting`)",
  "notificationBefore": "(t,r)=>{if(f(t,r)){G.debug(`[desktop-notifications] suppressed turn-complete`",
  "notificationAfter": "(t,r)=>{if(MTKattentionIgnored22530(Tf(r),t.conversationId)){G.debug(`[desktop-notifications] suppressed task-attention-policy turn-complete`,{safe:{conversationId:t.conversationId},sensitive:{}});return}if(f(t,r)){G.debug(`[desktop-notifications] suppressed turn-complete`",
  "primaryOwner": "function gJn(e){let t=(0,yJn.c)(189),",
  "primaryReact": "bJn",
  "titleBefore": "let Wt=vJn({title:kt,titleOverride:B})??(Ee&&ot?Ye.formatMessage({id:`codex.taskRow.pinnedTitleFallback`,defaultMessage:`Pinned chat`,description:`Sidebar title for a pinned chat whose title is unavailable`}):Ye.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`})),Gt=",
  "titleAfter": "let Wt=vJn({title:kt,titleOverride:B})??(Ee&&ot?Ye.formatMessage({id:`codex.taskRow.pinnedTitleFallback`,defaultMessage:`Pinned chat`,description:`Sidebar title for a pinned chat whose title is unavailable`}):Ye.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`})),MTKattentionIgnoredForTask=MTKuseTaskAttention22530(Wt,r),Gt=",
  "pristinePrimary": [
    "Kt=Ht?!1:fe??ht===!0,qt=Ht||mt!=null?0:gt??0",
    "hasUnreadTurn:!Ht&&ht===!0"
  ],
  "patchedPrimary": [
    "Kt=MTKattentionIgnoredForTask?!1:Ht?!1:fe??ht===!0,qt=MTKattentionIgnoredForTask?0:Ht||mt!=null?0:gt??0",
    "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Ht&&ht===!0"
  ],
  "applied": {
    "app": [
      "const MTKattentionRosterBridge=1",
      "MTKattentionPolicyAtom=kt(q,0)",
      "function MTKattentionIgnoredThread22530(",
      "function MTKattentionSubscribe22530(",
      "function MTKuseAttentionBootstrap22530(",
      "function ZW(){MTKuseAttentionBootstrap22530();MTKuseAgentRoster();MTKusePaletteBootstrap();",
      "s=s.filter(t=>!MTKattentionIgnoredThread22530(e,t))",
      "[desktop-notifications] suppressed task-attention-policy turn-complete"
    ],
    "primary": [
      "function MTKuseTaskAttention22530(",
      "MTKattentionIgnoredForTask=MTKuseTaskAttention22530(Wt,r)",
      "Kt=MTKattentionIgnoredForTask?!1:Ht?!1:",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Ht&&ht===!0"
    ]
  }
};
