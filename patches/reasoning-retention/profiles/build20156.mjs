export const build20156 = {
  activityToggle: "onToggle:e=>{let t=!d;S.current+=1,g.current=e,h(t),p(!t),(r??u)(t)}",
  turn: {
    react: "gl",
    reactOwner: "gl=z()",
    reactUse: "(0,gl.useState)",
    ownerFunction: "function Lc(e){let t=(0,ml.c)(244),",
    identityOwner: "conversationId:c,hostId:l,historyEntityKey:u,turnSearchKey:p,turnId:g,",
    owner: "preventAutoCollapse:Kt&&K||ft||sr",
    appliedOwner: "preventAutoCollapse:Kt&&K||ft||sr||MTKreasoningRetained",
    decisionBefore: "sr=Jn.some(Zc),cr;",
    decisionAfter: "sr=Jn.some(Zc),MTKreasoningRetained=MTKuseReasoningRetention(c),cr;"
  },
  thread: {
    react: "$A",
    reactOwner: "$A=qt()",
    reactUse: "(0,$A.useEffect)",
    ownerFunction: "function UA({ref:e,conversationId:t,",
    owner: "n!=null&&n!==Ne&&!GA(r)&&Gk(w,{conversationId:t,turnSearchKey:n},!0),Dt.current=Ne},[t,p,Ne,w,Le])",
    decisionBefore: "usesUnifiedTimeline:C}){let w=he(nn)",
    decisionAfter: "usesUnifiedTimeline:C}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(t),w=he(nn)",
    collapseBefore: "n!=null&&n!==Ne&&!GA(r)&&Gk(w,{conversationId:t,turnSearchKey:n},!0),Dt.current=Ne},[t,p,Ne,w,Le])",
    collapseAfter: "n!=null&&n!==Ne&&!GA(r)&&!MTKreasoningThreadRetained&&Gk(w,{conversationId:t,turnSearchKey:n},!0),Dt.current=Ne},[t,p,Ne,w,Le,MTKreasoningThreadRetained])",
    appliedCollapse: "!MTKreasoningThreadRetained&&Gk(w,{conversationId:t,turnSearchKey:n},!0)",
    appliedDependencies: "[t,p,Ne,w,Le,MTKreasoningThreadRetained]"
  }
};
