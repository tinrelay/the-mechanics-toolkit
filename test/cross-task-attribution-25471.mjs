import assert from "node:assert/strict";
import {parse} from "acorn";

export function probeAttribution25471(source, helper) {
  assert.ok(source.includes('c=n("zTeN")') && source.includes('eh=n("tl5a")'), "state bindings refer to the actual stock modules");
  assert.ok(source.includes('const MTKtitleAtom=eh.HX,MTKsourceThreadAtom=eh.ok,MTKcrossTaskState=c;'), "title and source metadata use their stock exports");
  const node = parse(source, {ecmaVersion: "latest"}).body.find(node => node.type === "FunctionDeclaration" && node.id.name === "e5");
  assert.ok(node, "delegated-message component owner");
  const component = source.slice(node.start, node.end);
  const titleAtom = Symbol("title"), metadataAtom = Symbol("source metadata");
  const cacheSize=component.includes("o=(0,s.c)(16)")?16:14;
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
  const values={s:{c(size){assert.equal(size,cacheSize);return cache}},MTKcrossTaskState:state,a:jsx,p:{Zp:()=>navigate},e2:{OX:()=>false},e0:{C:"Codex"},e4:{A:"app"},e1:{B:"asset"},e3:{A:"app"},L:{bF:"app"},m:{A:"translated-label"},J:"bubble-wrapper",MTKtitleAtom:titleAtom,MTKsourceThreadAtom:metadataAtom,MTKtinrelayPointerNode:()=>null};
  const render=Function(...Object.keys(values),`${helper};${component};return e5`)(...Object.values(values));
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
  console.log("build-25471 cross-task attribution behavior probe passed");
}
