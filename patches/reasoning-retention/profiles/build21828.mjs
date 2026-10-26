export const build21828 = {
  activityToggle: "onToggle:e=>{let t=!u;x.current+=1,h.current=e,m(t),f(!t),(r??l)(t)}",
  turn: {
    react: "Nl",
    reactOwner: "Nl=F()",
    reactUse: "(0,Nl.useContext)",
    ownerFunction: "function rl(e){let t=(0,jl.c)(255),",
    identityOwner: "conversationId:l,hostId:d,historyEntityKey:f,turnSearchKey:p,turnId:m,",
    owner: "preventAutoCollapse:Jt&&q||ct||or",
    appliedOwner: "preventAutoCollapse:Jt&&q||ct||or||MTKreasoningRetained",
    decisionBefore: "or=Yn.some(_l),sr;",
    decisionAfter: "or=Yn.some(_l),MTKreasoningRetained=MTKuseReasoningRetention(l),sr;"
  },
  thread: {
    react: "pF",
    reactOwner: "pF=St()",
    reactUse: "(0,pF.useEffect)",
    ownerFunction: "function rF({ref:e,conversationId:t,",
    owner: "n!=null&&n!==we&&!aF(r)&&nN(x,{conversationId:t,turnSearchKey:n},!0),gt.current=we},[t,d,we,x,De])",
    decisionBefore: "usesUnifiedTimeline:b}){let x=Wn(_i)",
    decisionAfter: "usesUnifiedTimeline:b}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(t),x=Wn(_i)",
    collapseBefore: "n!=null&&n!==we&&!aF(r)&&nN(x,{conversationId:t,turnSearchKey:n},!0),gt.current=we},[t,d,we,x,De])",
    collapseAfter: "n!=null&&n!==we&&!aF(r)&&!MTKreasoningThreadRetained&&nN(x,{conversationId:t,turnSearchKey:n},!0),gt.current=we},[t,d,we,x,De,MTKreasoningThreadRetained])",
    appliedCollapse: "!MTKreasoningThreadRetained&&nN(x,{conversationId:t,turnSearchKey:n},!0)",
    appliedDependencies: "[t,d,we,x,De,MTKreasoningThreadRetained]"
  }
};
