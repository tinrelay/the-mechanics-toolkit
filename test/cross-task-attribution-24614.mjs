import assert from "node:assert/strict";
import {parse} from "acorn";

export function probeAttribution24614(source, helper) {
  assert.ok(source.includes('r=n("y5DF")') && source.includes('ed=n("tl5a")'), "state bindings refer to the actual stock modules");
  assert.ok(source.includes('const MTKtitleAtom=ed.HX,MTKsourceThreadAtom=ed.ok,MTKcrossTaskState=r;'), "title and source metadata use their stock exports");
  const node = parse(source, {ecmaVersion: "latest"}).body.find(node => node.type === "FunctionDeclaration" && node.id.name === "eX");
  assert.ok(node, "delegated-message component owner");
  const component = source.slice(node.start, node.end);
  const titleAtom = Symbol("title"), metadataAtom = Symbol("source metadata");
  const cacheSize=component.includes("l=(0,a.c)(16)")?16:14;
  const cache = Array(cacheSize).fill(Symbol.for("react.memo_cache_sentinel"));
  let title = "Ada — Coordination", summary = {cwd: "/projects/source"};
  const navigate = route => { assert.equal(route, "/local/source-id"); };
  const state = {_U(atom, key) {
    assert.deepEqual(key, {hostId: "local", threadId: "source-id"});
    if (atom === titleAtom) return title;
    assert.equal(atom, metadataAtom, "no permissive fake state lookup");
    return summary == null ? null : {summary};
  }};
  const jsx = {Fragment: "fragment", jsx: (type, props) => ({type, props}), jsxs: (type, props) => ({type, props})};
  const render = Function("a", "MTKcrossTaskState", "s", "m", "eK", "eJ", "eY", "eQ", "u", "Z", "MTKtitleAtom", "MTKsourceThreadAtom", "MTKtinrelayPointerNode", `${helper};${component};return eX`)(
    {c(size) { assert.equal(size, cacheSize); return cache; }}, state, jsx,
    {Zp: () => navigate}, {OX: () => false}, {C: "Codex"}, {A: "app"}, {A: "app"}, {A: "translated-label"}, "bubble-wrapper", titleAtom, metadataAtom, ()=>null
  );
  const props = {conversationId: "receiver-id", sourceThreadId: "source-id", message: "test", sentAtMs: 1, cwd: "/projects/receiver", hostId: "local"};
  let result = render(props);
  assert.equal(result.props.label.props.children.at(-1).props.children, "Ada");
  assert.equal(result.props.alignment, "end", "incoming task messages stay right-aligned");
  assert.ok(result.props.accentColor.includes("interactive-bg-accent-muted-context"));
  result.props.onLabelClick();
  title = "search implementation agent";
  summary = {cwd: "/projects/example-search"};
  result = render(props);
  assert.equal(result.props.label.props.children.at(-1).props.children, "example-search/search implementation agent", "title hydration invalidates the cached bubble and uses the sender's project");
  summary = null;
  result = render(props);
  assert.equal(result.props.label.props.children.at(-1).props.children, title, "missing source metadata does not borrow the receiver's project");
  console.log("build-24614 cross-task attribution behavior probe passed");
}
