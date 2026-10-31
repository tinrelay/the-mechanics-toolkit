export const build22943 = {
  "suffix": "22943",
  "pristineAppRoot": "function PK(){let e=(0,RK.c)(12),t=G(U),",
  "appRootBefore": "function PK(){MTKuseAgentRoster();MTKusePaletteBootstrap();",
  "appRootAfter": "function PK(){MTKuseAttentionBootstrap22943();MTKuseAgentRoster();MTKusePaletteBootstrap();",
  "scopeAfter": "G(U)",
  "react": "BK",
  "decoder": "MTKattentionDecode",
  "localMatch": "null,n.threadId",
  "remoteMatch": "null,n.taskId",
  "atomFactoryContract": "AA=ge(U,!1)",
  "atomBefore": "lU=o(U,({get:e})=>",
  "atomAfter": "MTKattentionPolicyAtom=ge(U,0),lU=o(U,({get:e})=>",
  "dockBefore": "c=t===`work`?l_({cloudThreadsAllowed:a,localThreadsAllowed:Tm(e(oc)),threadKeys:s}):s;return i+",
  "dockAfter": "c=t===`work`?l_({cloudThreadsAllowed:a,localThreadsAllowed:Tm(e(oc)),threadKeys:s}):s,u=e(MTKattentionPolicyAtom);u!=null&&(c=c.filter(t=>!MTKattentionIgnoredThread22943(e,t)));return i+",
  "notificationOwner": "function SU(e,t){L.info(`[desktop-notifications] service starting`)",
  "notificationBefore": "(t,r)=>{if(f(t,r)){L.debug(`[desktop-notifications] suppressed turn-complete`",
  "notificationAfter": "(t,r)=>{if(MTKattentionIgnored22943(El(r),t.conversationId)){L.debug(`[desktop-notifications] suppressed task-attention-policy turn-complete`,{safe:{conversationId:t.conversationId},sensitive:{}});return}if(f(t,r)){L.debug(`[desktop-notifications] suppressed turn-complete`",
  "primaryOwner": "function PUn(e){let t=(0,LUn.c)(191),",
  "primaryReact": "RUn",
  "titleBefore": "let Xt=IUn({title:Ft,titleOverride:V})??(De&&ft?Ze.formatMessage({id:`codex.taskRow.pinnedTitleFallback`,defaultMessage:`Pinned chat`,description:`Sidebar title for a pinned chat whose title is unavailable`}):Ze.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`})),Qt=",
  "titleAfter": "let Xt=IUn({title:Ft,titleOverride:V})??(De&&ft?Ze.formatMessage({id:`codex.taskRow.pinnedTitleFallback`,defaultMessage:`Pinned chat`,description:`Sidebar title for a pinned chat whose title is unavailable`}):Ze.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`})),MTKattentionIgnoredForTask=MTKuseTaskAttention22943(Xt,r),Qt=",
  "pristinePrimary": [
    "$t=Jt?!1:me??xt===!0,en=Jt||bt!=null?0:St??0",
    "hasUnreadTurn:!Jt&&xt===!0"
  ],
  "patchedPrimary": [
    "$t=MTKattentionIgnoredForTask?!1:Jt?!1:me??xt===!0,en=MTKattentionIgnoredForTask?0:Jt||bt!=null?0:St??0",
    "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Jt&&xt===!0"
  ],
  "applied": {
    "app": [
      "const MTKattentionRosterBridge=1",
      "MTKattentionPolicyAtom=ge(U,0)",
      "function MTKattentionIgnoredThread22943(",
      "function MTKattentionSubscribe22943(",
      "function MTKuseAttentionBootstrap22943(",
      "function PK(){MTKuseAttentionBootstrap22943();MTKuseAgentRoster();MTKusePaletteBootstrap();",
      "c=c.filter(t=>!MTKattentionIgnoredThread22943(e,t))",
      "[desktop-notifications] suppressed task-attention-policy turn-complete"
    ],
    "primary": [
      "function MTKuseTaskAttention22943(",
      "MTKattentionIgnoredForTask=MTKuseTaskAttention22943(Xt,r)",
      "$t=MTKattentionIgnoredForTask?!1:Jt?!1:",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Jt&&xt===!0"
    ]
  }
};
