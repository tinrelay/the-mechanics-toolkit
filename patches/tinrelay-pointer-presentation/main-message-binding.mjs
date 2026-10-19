export function mainMessageBinding(source) {
  const anchor = "case`electron-add-new-workspace-root-option`:";
  const index = source.indexOf(anchor);
  if (index < 0 || source.indexOf(anchor, index + 1) !== -1) {
    throw new Error("Upstream changed: Tinrelay main message anchor is not unique");
  }
  const prefix = source.slice(0, index);
  const owners = [...prefix.matchAll(/async (?:handleMessage|function handler)\(e,(t|n)\)\{/g)];
  const owner = owners.at(-1);
  if (owner == null || !prefix.slice(owner.index).includes(`switch(${owner[1]}.type){`)) {
    throw new Error("Upstream changed: Tinrelay main message request owner is not recognized");
  }
  return owner[1];
}
