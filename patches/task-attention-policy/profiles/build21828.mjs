export const build21828 = {
  "suffix": "21828",
  "pristineAppRoot": "function DW(){let e=(0,jW.c)(12),t=K(f),",
  "appRootBefore": "function DW(){MTKuseAgentRoster();MTKusePaletteBootstrap();",
  "appRootAfter": "function DW(){MTKuseAttentionBootstrap21828();MTKuseAgentRoster();MTKusePaletteBootstrap();",
  "scopeAfter": "K(f)",
  "react": "NW",
  "decoder": "MTKattentionDecode",
  "localMatch": "null,n.threadId",
  "remoteMatch": "null,n.taskId",
  "atomFactoryContract": "uk=ze(f,!1)",
  "atomBefore": "pV=y(f,({get:e})=>",
  "atomAfter": "MTKattentionPolicyAtom=ze(f,0),pV=y(f,({get:e})=>",
  "dockBefore": "s=t===`work`?gp({cloudThreadsAllowed:i,localThreadsAllowed:Js(e(wc)),threadKeys:o}):o;return r+",
  "dockAfter": "s=t===`work`?gp({cloudThreadsAllowed:i,localThreadsAllowed:Js(e(wc)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread21828(e,t)));return r+",
  "notificationOwner": "function EV(e,t){U.info(`[desktop-notifications] service starting`)",
  "notificationBefore": "(t,r)=>{if(f(t,r)){U.debug(`[desktop-notifications] suppressed turn-complete`",
  "notificationAfter": "(t,r)=>{if(MTKattentionIgnored21828(Wi(r),t.conversationId)){U.debug(`[desktop-notifications] suppressed task-attention-policy turn-complete`,{safe:{conversationId:t.conversationId},sensitive:{}});return}if(f(t,r)){U.debug(`[desktop-notifications] suppressed turn-complete`",
  "primaryOwner": "function LJn(e){let t=(0,zJn.c)(176),",
  "primaryReact": "BJn",
  "titleBefore": "let Zt=RJn({title:Ft,titleOverride:H})??(Oe&&ft?$e.formatMessage({id:`codex.taskRow.pinnedTitleFallback`,defaultMessage:`Pinned chat`,description:`Sidebar title for a pinned chat whose title is unavailable`}):$e.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`})),Qt=",
  "titleAfter": "let Zt=RJn({title:Ft,titleOverride:H})??(Oe&&ft?$e.formatMessage({id:`codex.taskRow.pinnedTitleFallback`,defaultMessage:`Pinned chat`,description:`Sidebar title for a pinned chat whose title is unavailable`}):$e.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`})),MTKattentionIgnoredForTask=MTKuseTaskAttention21828(Zt,r),Qt=",
  "pristinePrimary": [
    "$t=Yt?!1:(he??xt===!0)||Be&&(bt==null&&(St??0)>0||Dt!=null||He),en=Yt||Be||bt!=null?0:St??0",
    "hasUnreadTurn:!Yt&&xt===!0"
  ],
  "patchedPrimary": [
    "$t=MTKattentionIgnoredForTask?!1:Yt?!1:(he??xt===!0)||Be&&(bt==null&&(St??0)>0||Dt!=null||He),en=MTKattentionIgnoredForTask?0:Yt||Be||bt!=null?0:St??0",
    "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Yt&&xt===!0"
  ],
  "applied": {
    "app": [
      "const MTKattentionRosterBridge=1",
      "MTKattentionPolicyAtom=ze(f,0)",
      "function MTKattentionIgnoredThread21828(",
      "function MTKattentionSubscribe21828(",
      "function MTKuseAttentionBootstrap21828(",
      "function DW(){MTKuseAttentionBootstrap21828();MTKuseAgentRoster();MTKusePaletteBootstrap();",
      "s=s.filter(t=>!MTKattentionIgnoredThread21828(e,t))",
      "[desktop-notifications] suppressed task-attention-policy turn-complete"
    ],
    "primary": [
      "function MTKuseTaskAttention21828(",
      "MTKattentionIgnoredForTask=MTKuseTaskAttention21828(Zt,r)",
      "$t=MTKattentionIgnoredForTask?!1:Yt?!1:",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Yt&&xt===!0"
    ]
  }
};
