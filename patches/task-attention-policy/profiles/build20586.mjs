export const build20586 = {
  "suffix": "20586",
  "pristineAppRoot": "function Suu(){let e=(0,Tuu.c)(12),t=hi(U),",
  "appRootBefore": "function Suu(){MTKuseAgentRoster();MTKusePaletteBootstrap();",
  "appRootAfter": "function Suu(){MTKuseAttentionBootstrap20586();MTKuseAgentRoster();MTKusePaletteBootstrap();",
  "scopeAfter": "hi(U)",
  "react": "Euu",
  "decoder": "TD",
  "localMatch": "null,n.threadId",
  "remoteMatch": "null,n.taskId",
  "atomFactoryContract": "cqi=cs(U,0)",
  "atomBefore": "oru=Y(U,({get:e})=>",
  "atomAfter": "MTKattentionPolicyAtom=cs(U,0),oru=Y(U,({get:e})=>",
  "dockBefore": "s=t===`work`?Y7n({cloudThreadsAllowed:i,localThreadsAllowed:lO(e($g)),threadKeys:o}):o;return r+",
  "dockAfter": "s=t===`work`?Y7n({cloudThreadsAllowed:i,localThreadsAllowed:lO(e($g)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread20586(e,t)));return r+",
  "notificationOwner": "function Fru(e,t){fn.info(`[desktop-notifications] service starting`)",
  "notificationBefore": "(t,r)=>{if(f(t,r)){fn.debug(`[desktop-notifications] suppressed turn-complete`",
  "notificationAfter": "(t,r)=>{if(MTKattentionIgnored20586(rnr(r),t.conversationId)){fn.debug(`[desktop-notifications] suppressed task-attention-policy turn-complete`,{safe:{conversationId:t.conversationId},sensitive:{}});return}if(f(t,r)){fn.debug(`[desktop-notifications] suppressed turn-complete`",
  "primaryOwner": "function fPc(e){let t=(0,mPc.c)(169),",
  "primaryReact": "hPc",
  "titleBefore": "let Yt=pPc({title:Pt,titleOverride:B})??tt.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`}),Xt=",
  "titleAfter": "let Yt=pPc({title:Pt,titleOverride:B})??tt.formatMessage({id:`codex.taskRow.title`,defaultMessage:`New chat`,description:`Default title for a Codex task that doesn't have a title`}),MTKattentionIgnoredForTask=MTKuseTaskAttention20586(Yt,r),Xt=",
  "pristinePrimary": [
    "Zt=qt?!1:(_e??bt===!0)||Ve&&(yt==null&&(xt??0)>0||Et!=null||Ue),Qt=qt||Ve||yt!=null?0:xt??0",
    "hasUnreadTurn:!qt&&bt===!0"
  ],
  "patchedPrimary": [
    "Zt=MTKattentionIgnoredForTask?!1:qt?!1:(_e??bt===!0)||Ve&&(yt==null&&(xt??0)>0||Et!=null||Ue),Qt=MTKattentionIgnoredForTask?0:qt||Ve||yt!=null?0:xt??0",
    "hasUnreadTurn:!MTKattentionIgnoredForTask&&!qt&&bt===!0"
  ],
  "applied": {
    "app": [
      "const MTKattentionRosterBridge=1",
      "MTKattentionPolicyAtom=cs(U,0)",
      "function MTKattentionIgnoredThread20586(",
      "function MTKattentionSubscribe20586(",
      "function MTKuseAttentionBootstrap20586(",
      "function Suu(){MTKuseAttentionBootstrap20586();MTKuseAgentRoster();MTKusePaletteBootstrap();",
      "s=s.filter(t=>!MTKattentionIgnoredThread20586(e,t))",
      "[desktop-notifications] suppressed task-attention-policy turn-complete"
    ],
    "primary": [
      "function MTKuseTaskAttention20586(",
      "MTKattentionIgnoredForTask=MTKuseTaskAttention20586(Yt,r)",
      "Zt=MTKattentionIgnoredForTask?!1:qt?!1:",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!qt&&bt===!0"
    ]
  }
};
