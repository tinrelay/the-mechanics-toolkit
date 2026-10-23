export const build21421 = {
  activityToggle: "onToggle:e=>{let t=!u;x.current+=1,h.current=e,m(t),f(!t),(r??l)(t)}",
  turn: {
    react: "yl",
    reactOwner: "yl=l()",
    reactUse: "(0,yl.useContext)",
    ownerFunction: "function Bc(e){let t=(0,_l.c)(252),",
    identityOwner: "conversationId:l,hostId:u,historyEntityKey:d,turnSearchKey:f,turnId:p,",
    owner: "preventAutoCollapse:Vt&&q||rt||dr",
    appliedOwner: "preventAutoCollapse:Vt&&q||rt||dr||MTKreasoningRetained",
    decisionBefore: "dr=Xn.some(el),fr;",
    decisionAfter: "dr=Xn.some(el),MTKreasoningRetained=MTKuseReasoningRetention(l),fr;"
  },
  thread: {
    react: "xA",
    reactOwner: "xA=w()",
    reactUse: "(0,xA.useEffect)",
    ownerFunction: "function dA({ref:e,conversationId:t,",
    owner: "n!=null&&n!==ke&&!pA(r)&&dk(C,{conversationId:t,turnSearchKey:n},!0),gt.current=ke},[t,f,ke,C,Me])",
    decisionBefore: "usesUnifiedTimeline:S}){let C=o(ro)",
    decisionAfter: "usesUnifiedTimeline:S}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(t),C=o(ro)",
    collapseBefore: "n!=null&&n!==ke&&!pA(r)&&dk(C,{conversationId:t,turnSearchKey:n},!0),gt.current=ke},[t,f,ke,C,Me])",
    collapseAfter: "n!=null&&n!==ke&&!pA(r)&&!MTKreasoningThreadRetained&&dk(C,{conversationId:t,turnSearchKey:n},!0),gt.current=ke},[t,f,ke,C,Me,MTKreasoningThreadRetained])",
    appliedCollapse: "!MTKreasoningThreadRetained&&dk(C,{conversationId:t,turnSearchKey:n},!0)",
    appliedDependencies: "[t,f,ke,C,Me,MTKreasoningThreadRetained]"
  }
};
