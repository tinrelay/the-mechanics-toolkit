export const build22943 = {
  "activityToggle": "onToggle:e=>{let t=!u;x.current+=1,h.current=e,m(t),f(!t),(r??l)(t)}",
  "turn": {
    "react": "Sl",
    "reactOwner": "Sl=Ce()",
    "reactUse": "(0,Sl.useContext)",
    "ownerFunction": "function Kc(e){let t=(0,bl.c)(254),",
    "identityOwner": "conversationId:l,hostId:u,historyEntityKey:d,turnSearchKey:f,turnId:p,",
    "owner": "preventAutoCollapse:zt&&G||ot||nr",
    "appliedOwner": "preventAutoCollapse:zt&&G||ot||nr||MTKreasoningRetained",
    "decisionBefore": "nr=Gn.some(ol),ar;",
    "decisionAfter": "nr=Gn.some(ol),MTKreasoningRetained=MTKuseReasoningRetention(l),ar;"
  },
  "thread": {
    "react": "vI",
    "reactOwner": "vI=Jn()",
    "reactUse": "(0,vI.useEffect)",
    "ownerFunction": "function cI({ref:e,conversationId:t,",
    "owner": "n!=null&&n!==Te&&!uI(r)&&sP(x,{conversationId:t,turnSearchKey:n},!0),mt.current=Te},[t,d,Te,x,ke])",
    "decisionBefore": "usesUnifiedTimeline:b}){let x=Gn(rd)",
    "decisionAfter": "usesUnifiedTimeline:b}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(t),x=Gn(rd)",
    "collapseBefore": "n!=null&&n!==Te&&!uI(r)&&sP(x,{conversationId:t,turnSearchKey:n},!0),mt.current=Te},[t,d,Te,x,ke])",
    "collapseAfter": "n!=null&&n!==Te&&!uI(r)&&!MTKreasoningThreadRetained&&sP(x,{conversationId:t,turnSearchKey:n},!0),mt.current=Te},[t,d,Te,x,ke,MTKreasoningThreadRetained])",
    "appliedCollapse": "!MTKreasoningThreadRetained&&sP(x,{conversationId:t,turnSearchKey:n},!0)",
    "appliedDependencies": "[t,d,Te,x,ke,MTKreasoningThreadRetained]"
  }
};
