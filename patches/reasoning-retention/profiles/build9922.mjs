export const build9922 = {
  activityToggle: "onToggle:e=>{let t=!ne;if(M.current=e,d==null){A(t);return}d(t)}",
  turn: {
    react: "_l",
    ownerFunction: "function Uc(e){let t=(0,hl.c)(189),",
    owner: "preventAutoCollapse:Ke||Pn",
    appliedOwner: "preventAutoCollapse:Ke||Pn||MTKreasoningRetained",
    decisionBefore: "let Ge=We,Ke=J(Be,Ge)",
    decisionAfter: "let Ge=We,MTKreasoningRetained=MTKuseReasoningRetention(d),Ke=J(Be,Ge)"
  },
  thread: {
    react: "hj",
    ownerFunction: "function dj({conversationId:e,",
    owner: "Ke.current=ue},[e,c,ue,b,fe])",
    decisionBefore: "usesUnifiedTimeline:y}){let b=ju(il)",
    decisionAfter: "usesUnifiedTimeline:y}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(e),b=ju(il)",
    collapseBefore: "Fk(b,{conversationId:e,turnSearchKey:n},!0),Ke.current=ue},[e,c,ue,b,fe])",
    collapseAfter: "MTKreasoningThreadRetained||Fk(b,{conversationId:e,turnSearchKey:n},!0),Ke.current=ue},[e,c,ue,b,fe,MTKreasoningThreadRetained])",
    appliedCollapse: "MTKreasoningThreadRetained||Fk(b,{conversationId:e,turnSearchKey:n},!0)",
    appliedDependencies: "[e,c,ue,b,fe,MTKreasoningThreadRetained]"
  }
};
