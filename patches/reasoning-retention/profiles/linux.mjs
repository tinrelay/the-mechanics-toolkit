export const linuxBuild9647 = {
  activityToggle: "onToggle:e=>{let t=!J;if(M.current=e,d==null){A(t);return}d(t)}",
  turn: {
    react: "K",
    ownerFunction: "function Z(e){let t=(0,Ba.c)(182),",
    owner: "preventAutoCollapse:St||ir",
    appliedOwner: "preventAutoCollapse:St||ir||MTKreasoningRetained",
    decisionBefore: "let R=yt,St=H(Ir,R)",
    decisionAfter: "let R=yt,MTKreasoningRetained=MTKuseReasoningRetention(l),St=H(Ir,R)"
  },
  thread: {
    react: "wM",
    ownerFunction: "function bM({conversationId:e,",
    owner: "Ge.current=le},[e,l,le,b,fe])",
    decisionBefore: "usesUnifiedTimeline:y}){let b=Sc(Hc)",
    decisionAfter: "usesUnifiedTimeline:y}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(e),b=Sc(Hc)",
    collapseBefore: "for(let t of i)gA(b,{conversationId:e,turnSearchKey:t},!0);Ge.current=le},[e,l,le,b,fe])",
    collapseAfter: "if(!MTKreasoningThreadRetained)for(let t of i)gA(b,{conversationId:e,turnSearchKey:t},!0);Ge.current=le},[e,l,le,b,fe,MTKreasoningThreadRetained])",
    appliedCollapse: "if(!MTKreasoningThreadRetained)for(let t of i)gA(b,{conversationId:e,turnSearchKey:t},!0)",
    appliedDependencies: "[e,l,le,b,fe,MTKreasoningThreadRetained]"
  }
};
