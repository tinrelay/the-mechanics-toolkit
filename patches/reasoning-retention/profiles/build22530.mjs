export const build22530 = {
  "activityToggle": "onToggle:e=>{let t=!u;x.current+=1,h.current=e,m(t),f(!t),(r??l)(t)}",
  "turn": {
    "react": "Pl",
    "reactOwner": "Pl=S()",
    "reactUse": "(0,Pl.useContext)",
    "ownerFunction": "function il(e){let t=(0,Ml.c)(255),",
    "identityOwner": "conversationId:l,hostId:u,historyEntityKey:d,turnSearchKey:h,turnId:g,",
    "owner": "preventAutoCollapse:Kt&&G||dt||sr",
    "appliedOwner": "preventAutoCollapse:Kt&&G||dt||sr||MTKreasoningRetained",
    "decisionBefore": "sr=Yn.some(vl),lr;",
    "decisionAfter": "sr=Yn.some(vl),MTKreasoningRetained=MTKuseReasoningRetention(l),lr;"
  },
  "thread": {
    "react": "wF",
    "reactOwner": "wF=J()",
    "reactUse": "(0,wF.useEffect)",
    "ownerFunction": "function mF({ref:e,conversationId:t,",
    "owner": "n!=null&&n!==Me&&!gF(r)&&pN(S,{conversationId:t,turnSearchKey:n},!0),St.current=Me},[t,d,Me,S,Fe])",
    "decisionBefore": "usesUnifiedTimeline:x}){let S=ie(hp)",
    "decisionAfter": "usesUnifiedTimeline:x}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(t),S=ie(hp)",
    "collapseBefore": "n!=null&&n!==Me&&!gF(r)&&pN(S,{conversationId:t,turnSearchKey:n},!0),St.current=Me},[t,d,Me,S,Fe])",
    "collapseAfter": "n!=null&&n!==Me&&!gF(r)&&!MTKreasoningThreadRetained&&pN(S,{conversationId:t,turnSearchKey:n},!0),St.current=Me},[t,d,Me,S,Fe,MTKreasoningThreadRetained])",
    "appliedCollapse": "!MTKreasoningThreadRetained&&pN(S,{conversationId:t,turnSearchKey:n},!0)",
    "appliedDependencies": "[t,d,Me,S,Fe,MTKreasoningThreadRetained]"
  }
};
