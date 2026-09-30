export const build12246 = {
  activityToggle: "onToggle:e=>{let t=!xe;H.current+=1,L.current=e,I(t),ee(!t),f==null?N(t):f(t)}",
  turn: {
    react: "hl",
    reactOwner: "hl=dn()",
    reactUse: "(0,hl.useState)",
    ownerFunction: "function Lc(e){let t=(0,pl.c)(229),",
    owner: "preventAutoCollapse:Yt&&q||ct||mr",
    appliedOwner: "preventAutoCollapse:Yt&&q||ct||mr||MTKreasoningRetained",
    decisionBefore: "mr=Qn.some(Zc),hr;",
    decisionAfter: "mr=Qn.some(Zc),MTKreasoningRetained=MTKuseReasoningRetention(d),hr;"
  },
  thread: {
    react: "uj",
    ownerFunction: "function ej({ref:e,conversationId:t,",
    owner: "n!=null&&n!==De&&!nj(r)&&Xk(C,{conversationId:t,turnSearchKey:n},!0),bt.current=De},[t,f,De,C,Ae])",
    decisionBefore: "usesUnifiedTimeline:S}){let C=p(_o)",
    decisionAfter: "usesUnifiedTimeline:S}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(t),C=p(_o)",
    collapseBefore: "n!=null&&n!==De&&!nj(r)&&Xk(C,{conversationId:t,turnSearchKey:n},!0),bt.current=De},[t,f,De,C,Ae])",
    collapseAfter: "n!=null&&n!==De&&!nj(r)&&!MTKreasoningThreadRetained&&Xk(C,{conversationId:t,turnSearchKey:n},!0),bt.current=De},[t,f,De,C,Ae,MTKreasoningThreadRetained])",
    appliedCollapse: "!MTKreasoningThreadRetained&&Xk(C,{conversationId:t,turnSearchKey:n},!0)",
    appliedDependencies: "[t,f,De,C,Ae,MTKreasoningThreadRetained]"
  }
};
