export const build12404 = {
  activityToggle: "onToggle:e=>{let t=!xe;ne.current+=1,L.current=e,I(t),ee(!t),f==null?N(t):f(t)}",
  turn: {
    react: "hl",
    reactOwner: "hl=dn()",
    reactUse: "(0,hl.useState)",
    ownerFunction: "function Lc(e){let t=(0,pl.c)(229),",
    owner: "preventAutoCollapse:Yt&&J||ct||fr",
    appliedOwner: "preventAutoCollapse:Yt&&J||ct||fr||MTKreasoningRetained",
    decisionBefore: "fr=Zn.some(Zc),pr;",
    decisionAfter: "fr=Zn.some(Zc),MTKreasoningRetained=MTKuseReasoningRetention(d),pr;"
  },
  thread: {
    react: "fj",
    ownerFunction: "function nj({ref:e,conversationId:t,",
    owner: "n!=null&&n!==De&&!ij(r)&&Qk(C,{conversationId:t,turnSearchKey:n},!0),yt.current=De},[t,f,De,C,je])",
    decisionBefore: "usesUnifiedTimeline:S}){let C=h(wo)",
    decisionAfter: "usesUnifiedTimeline:S}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(t),C=h(wo)",
    collapseBefore: "n!=null&&n!==De&&!ij(r)&&Qk(C,{conversationId:t,turnSearchKey:n},!0),yt.current=De},[t,f,De,C,je])",
    collapseAfter: "n!=null&&n!==De&&!ij(r)&&!MTKreasoningThreadRetained&&Qk(C,{conversationId:t,turnSearchKey:n},!0),yt.current=De},[t,f,De,C,je,MTKreasoningThreadRetained])",
    appliedCollapse: "!MTKreasoningThreadRetained&&Qk(C,{conversationId:t,turnSearchKey:n},!0)",
    appliedDependencies: "[t,f,De,C,je,MTKreasoningThreadRetained]"
  }
};
