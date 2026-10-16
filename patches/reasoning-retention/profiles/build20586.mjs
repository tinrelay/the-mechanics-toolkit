export const build20586 = {
  activityToggle: "onToggle:e=>{let t=!u;x.current+=1,h.current=e,m(t),f(!t),(r??l)(t)}",
  turn: {
    react: "ml",
    reactOwner: "ml=ke()",
    reactUse: "(0,ml.useContext)",
    ownerFunction: "function Fc(e){let t=(0,fl.c)(246),",
    identityOwner: "conversationId:u,hostId:d,historyEntityKey:f,turnSearchKey:g,turnId:v,",
    owner: "preventAutoCollapse:Bt&&K||nt||or",
    appliedOwner: "preventAutoCollapse:Bt&&K||nt||or||MTKreasoningRetained",
    decisionBefore: "or=Wn.some(Yc),sr;",
    decisionAfter: "or=Wn.some(Yc),MTKreasoningRetained=MTKuseReasoningRetention(u),sr;"
  },
  thread: {
    react: "vA",
    reactOwner: "vA=Yn()",
    reactUse: "(0,vA.useEffect)",
    ownerFunction: "function cA({ref:e,conversationId:t,",
    owner: "n!=null&&n!==Oe&&!uA(r)&&ck(S,{conversationId:t,turnSearchKey:n},!0),_t.current=Oe},[t,d,Oe,S,je])",
    decisionBefore: "usesUnifiedTimeline:x}){let S=ee(Hl)",
    decisionAfter: "usesUnifiedTimeline:x}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(t),S=ee(Hl)",
    collapseBefore: "n!=null&&n!==Oe&&!uA(r)&&ck(S,{conversationId:t,turnSearchKey:n},!0),_t.current=Oe},[t,d,Oe,S,je])",
    collapseAfter: "n!=null&&n!==Oe&&!uA(r)&&!MTKreasoningThreadRetained&&ck(S,{conversationId:t,turnSearchKey:n},!0),_t.current=Oe},[t,d,Oe,S,je,MTKreasoningThreadRetained])",
    appliedCollapse: "!MTKreasoningThreadRetained&&ck(S,{conversationId:t,turnSearchKey:n},!0)",
    appliedDependencies: "[t,d,Oe,S,je,MTKreasoningThreadRetained]"
  }
};
