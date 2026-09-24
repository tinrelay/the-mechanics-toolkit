export const linuxBuild10954 = {
  stockPaginated: [
    "Qjs=Ia(X,({conversationId:e,isBackgroundSubagentsEnabled:t},{get:n,scope:r})=>{",
    "f=n(QL,s),p=f?.flatMap",
    "_=n(QL,g),v=o!=null&&h==null?_?.flatMap",
    "turnEntityKeys:f?.map(({entityKey:e})=>e)"
  ]
};

export const linuxBuild9771 = {
  currentBefore: "f=n(jI,s),p=f?.flatMap",
  currentAfter: "f=n(jI,s),UHrendererCurrentKeys=UHrendererTail(f,UHrendererTailLimit),p=UHrendererCurrentKeys?.flatMap",
  windowBefore: "m=l?.length===p.length&&(o==null||d!=null)&&!0,",
  windowAfter: "g=o==null?null:{hostId:n(XE,o),threadId:o},_=n(jI,g),UHrendererParentLimit=UHrendererTailLimit==null?null:Math.max(0,UHrendererTailLimit-(UHrendererCurrentKeys?.length??0)),UHrendererParentKeys=UHrendererTail(_,UHrendererParentLimit),UHrendererWindowActive=UHrendererTailLimit!=null&&((f?.length??0)+(_?.length??0)>UHrendererTailLimit),m=!UHrendererWindowActive&&l?.length===p.length&&(o==null||d!=null)&&!0,",
  parentBefore: "g=o==null?null:{hostId:n(XE,o),threadId:o},_=n(jI,g),v=o!=null&&h==null?_?.flatMap",
  parentAfter: "v=o!=null&&h==null?UHrendererParentKeys?.flatMap",
  entityBefore: "turnEntityKeys:f?.map(({entityKey:e})=>e)",
  entityAfter: "turnEntityKeys:UHrendererCurrentKeys?.map(({entityKey:e})=>e)",
  returnOwner: "return dlc({conversationRequests:a,isAeonThread:!1"
};
