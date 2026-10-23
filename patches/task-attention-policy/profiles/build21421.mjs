export const build21421 = {
  "suffix": "21421",
  "pristineAppRoot": "function Dbu(){let e=(0,Abu.c)(12),t=E(J),",
  "appRootBefore": "function Dbu(){MTKuseAgentRoster();MTKusePaletteBootstrap();",
  "appRootAfter": "function Dbu(){MTKuseAttentionBootstrap21421();MTKuseAgentRoster();MTKusePaletteBootstrap();",
  "scopeAfter": "E(J)",
  "react": "jbu",
  "decoder": "FD",
  "localMatch": "null,n.threadId",
  "remoteMatch": "null,n.taskId",
  "atomFactoryContract": "fEt=oc(J,0)",
  "atomBefore": "upu=W(J,({get:e})=>",
  "atomAfter": "MTKattentionPolicyAtom=oc(J,0),upu=W(J,({get:e})=>",
  "dockBefore": "s=t===`work`?Dnr({cloudThreadsAllowed:i,localThreadsAllowed:vO(e(s_)),threadKeys:o}):o;return r+",
  "dockAfter": "s=t===`work`?Dnr({cloudThreadsAllowed:i,localThreadsAllowed:vO(e(s_)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread21421(e,t)));return r+",
  "notificationOwner": "function zpu(e,t){iu.info(`[desktop-notifications] service starting`)",
  "notificationBefore": "(t,r)=>{if(f(t,r)){iu.debug(`[desktop-notifications] suppressed turn-complete`",
  "notificationAfter": "(t,r)=>{if(MTKattentionIgnored21421(war(r),t.conversationId)){iu.debug(`[desktop-notifications] suppressed task-attention-policy turn-complete`,{safe:{conversationId:t.conversationId},sensitive:{}});return}if(f(t,r)){iu.debug(`[desktop-notifications] suppressed turn-complete`",
  "primaryOwner": "function mHc(e){let t=(0,gHc.c)(168),",
  "primaryReact": "_Hc",
  "titleBefore": "let Xt=hHc({title:Ft,titleOverride:H})??nt.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`}),Zt=",
  "titleAfter": "let Xt=hHc({title:Ft,titleOverride:H})??nt.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`}),MTKattentionIgnoredForTask=MTKuseTaskAttention21421(Xt,r),Zt=",
  "pristinePrimary": [
    "Qt=Jt?!1:(ve??xt===!0)||He&&(bt==null&&(St??0)>0||Dt!=null||We),$t=Jt||He||bt!=null?0:St??0",
    "hasUnreadTurn:!Jt&&xt===!0"
  ],
  "patchedPrimary": [
    "Qt=MTKattentionIgnoredForTask?!1:Jt?!1:(ve??xt===!0)||He&&(bt==null&&(St??0)>0||Dt!=null||We),$t=MTKattentionIgnoredForTask?0:Jt||He||bt!=null?0:St??0",
    "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Jt&&xt===!0"
  ],
  "applied": {
    "app": [
      "const MTKattentionRosterBridge=1",
      "MTKattentionPolicyAtom=oc(J,0)",
      "function MTKattentionIgnoredThread21421(",
      "function MTKattentionSubscribe21421(",
      "function MTKuseAttentionBootstrap21421(",
      "function Dbu(){MTKuseAttentionBootstrap21421();MTKuseAgentRoster();MTKusePaletteBootstrap();",
      "s=s.filter(t=>!MTKattentionIgnoredThread21421(e,t))",
      "[desktop-notifications] suppressed task-attention-policy turn-complete"
    ],
    "primary": [
      "function MTKuseTaskAttention21421(",
      "MTKattentionIgnoredForTask=MTKuseTaskAttention21421(Xt,r)",
      "Qt=MTKattentionIgnoredForTask?!1:Jt?!1:",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Jt&&xt===!0"
    ]
  }
};
