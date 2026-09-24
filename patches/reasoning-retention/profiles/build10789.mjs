export const build10789 = {
  activityToggle: "onToggle:e=>{let t=!ie;if(N.current=e,f==null){j(t);return}f(t)}",
  turn: {
    react: "de()",
    ownerFunction: "function rl(e){let t=(0,kl.c)(189),",
    owner: "preventAutoCollapse:Ue||zn",
    appliedOwner: "preventAutoCollapse:Ue||zn||MTKreasoningRetained",
    decisionBefore: "let He=Ve,Ue=o(Pt,He)",
    decisionAfter: "let He=Ve,MTKreasoningRetained=MTKuseReasoningRetention(c),Ue=o(Pt,He)"
  },
  thread: {
    react: "Vj",
    ownerFunction: "function Lj({conversationId:e,",
    owner: "qe.current=fe},[e,l,fe,x,he])",
    decisionBefore: "usesUnifiedTimeline:b}){let x=J(Gn)",
    decisionAfter: "usesUnifiedTimeline:b}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(e),x=J(Gn)",
    collapseBefore: "n!=null&&n!==fe&&!Rj(r)&&fA(x,{conversationId:e,turnSearchKey:n},!0),qe.current=fe},[e,l,fe,x,he])",
    collapseAfter: "n!=null&&n!==fe&&!Rj(r)&&!MTKreasoningThreadRetained&&fA(x,{conversationId:e,turnSearchKey:n},!0),qe.current=fe},[e,l,fe,x,he,MTKreasoningThreadRetained])",
    appliedCollapse: "!MTKreasoningThreadRetained&&fA(x,{conversationId:e,turnSearchKey:n},!0)",
    appliedDependencies: "[e,l,fe,x,he,MTKreasoningThreadRetained]"
  }
};
