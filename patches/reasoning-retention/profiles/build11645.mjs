export const build11645 = {
  activityToggle: "onToggle:e=>{let t=!ue;F.current+=1,N.current=e,M(!t),d==null?A(t):d(t)}",
  turn: {
    react: "Gc",
    ownerFunction: "function gc(e){let t=(0,Uc.c)(188),",
    owner: "preventAutoCollapse:qe||In",
    appliedOwner: "preventAutoCollapse:qe||In||MTKreasoningRetained",
    decisionBefore: "let Ke=Ge,qe=K(Bn,Ke)",
    decisionAfter: "let Ke=Ge,MTKreasoningRetained=MTKuseReasoningRetention(d),qe=K(Bn,Ke)"
  },
  thread: {
    react: "cM",
    ownerFunction: "function eM({ref:e,conversationId:t,",
    owner: "it.current=Te},[t,h,Te,k,Oe])",
    decisionBefore: "usesUnifiedTimeline:D}){let k=zr(Er)",
    decisionAfter: "usesUnifiedTimeline:D}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(t),k=zr(Er)",
    collapseBefore: "n!=null&&n!==Te&&!tM(r)&&tA(k,{conversationId:t,turnSearchKey:n},!0),it.current=Te},[t,h,Te,k,Oe])",
    collapseAfter: "n!=null&&n!==Te&&!tM(r)&&!MTKreasoningThreadRetained&&tA(k,{conversationId:t,turnSearchKey:n},!0),it.current=Te},[t,h,Te,k,Oe,MTKreasoningThreadRetained])",
    appliedCollapse: "!MTKreasoningThreadRetained&&tA(k,{conversationId:t,turnSearchKey:n},!0)",
    appliedDependencies: "[t,h,Te,k,Oe,MTKreasoningThreadRetained]"
  }
};
