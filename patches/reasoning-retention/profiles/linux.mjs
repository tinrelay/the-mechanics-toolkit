export const linuxBuild9771 = {
  activityToggle: "onToggle:e=>{let t=!ae;if(M.current=e,d==null){A(t);return}d(t)}",
  turn: {
    react: "_l",
    ownerFunction: "function Uc(e){let t=(0,hl.c)(189),",
    owner: "preventAutoCollapse:Ge||In",
    appliedOwner: "preventAutoCollapse:Ge||In||MTKreasoningRetained",
    decisionBefore: "let We=Ue,Ge=q(Dt,We)",
    decisionAfter: "let We=Ue,MTKreasoningRetained=MTKuseReasoningRetention(c),Ge=q(Dt,We)"
  },
  thread: {
    react: "hj",
    ownerFunction: "function dj({conversationId:e,",
    owner: "qe.current=fe},[e,c,fe,y,Y])",
    decisionBefore: "usesUnifiedTimeline:v}){let y=Ai(Td)",
    decisionAfter: "usesUnifiedTimeline:v}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(e),y=Ai(Td)",
    collapseBefore: "n!=null&&n!==fe&&!fj(r)&&Fk(y,{conversationId:e,turnSearchKey:n},!0),qe.current=fe},[e,c,fe,y,Y])",
    collapseAfter: "n!=null&&n!==fe&&!fj(r)&&!MTKreasoningThreadRetained&&Fk(y,{conversationId:e,turnSearchKey:n},!0),qe.current=fe},[e,c,fe,y,Y,MTKreasoningThreadRetained])",
    appliedCollapse: "!MTKreasoningThreadRetained&&Fk(y,{conversationId:e,turnSearchKey:n},!0)",
    appliedDependencies: "[e,c,fe,y,Y,MTKreasoningThreadRetained]"
  }
};

export const linuxBuild9647 = {
  activityToggle: "onToggle:e=>{let t=!J;if(M.current=e,d==null){A(t);return}d(t)}",
  turn: {
    react: "K", ownerFunction: "function Z(e){let t=(0,Ba.c)(182),",
    owner: "preventAutoCollapse:St||ir",
    appliedOwner: "preventAutoCollapse:St||ir||MTKreasoningRetained",
    decisionBefore: "let R=yt,St=H(Ir,R)",
    decisionAfter: "let R=yt,MTKreasoningRetained=MTKuseReasoningRetention(l),St=H(Ir,R)"
  },
  thread: {
    react: "wM", ownerFunction: "function bM({conversationId:e,",
    owner: "Ge.current=le},[e,l,le,b,fe])",
    decisionBefore: "usesUnifiedTimeline:y}){let b=Sc(Hc)",
    decisionAfter: "usesUnifiedTimeline:y}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(e),b=Sc(Hc)",
    collapseBefore: "for(let t of i)gA(b,{conversationId:e,turnSearchKey:t},!0);Ge.current=le},[e,l,le,b,fe])",
    collapseAfter: "if(!MTKreasoningThreadRetained)for(let t of i)gA(b,{conversationId:e,turnSearchKey:t},!0);Ge.current=le},[e,l,le,b,fe,MTKreasoningThreadRetained])",
    appliedCollapse: "if(!MTKreasoningThreadRetained)for(let t of i)gA(b,{conversationId:e,turnSearchKey:t},!0)",
    appliedDependencies: "[e,l,le,b,fe,MTKreasoningThreadRetained]"
  }
};
