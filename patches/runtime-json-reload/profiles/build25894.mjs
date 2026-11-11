import fs from "node:fs";
import path from "node:path";
import {mainProcessAsset, mainLoggerOwner, mainMessageAnchor} from "../../../src/main-process-asset.mjs";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";

export function matchesBuild25894(root) {
  if (!fs.existsSync(path.join(root, "package.json"))) return false;
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  return manifest.version === "26.1103.60933" && String(manifest.codexBuildNumber) === "25894";
}

export function runtimeOwner25894(root) {
  const entry = path.join(root, "webview/assets/348410.fcfef000d0.js");
  const html = fs.readFileSync(path.join(root, "webview/index.html"), "utf8");
  if (!html.includes('src="/assets/348410.fcfef000d0.js"')) throw new Error("Upstream changed: renderer runtime entry is not selected");
  return {file: entry, id: "TL6G", parameters: ["e", "a", "c"], registry: "u"};
}

export function runBuild25894({root, command, rendererHelper, mainHelper}) {
  const owner = runtimeOwner25894(root), main = mainProcessAsset(root);
  let renderer = readRendererModule(owner), native = fs.readFileSync(main, "utf8");
  const before = 'let s=o.getInstance();s.initialize(),c.d(a,{},{JX:function(e,a,c){';
  const after = before.replace("s.initialize(),", "s.initialize(),MTKinstallRuntimeJsonReload(),");
  const logger = mainLoggerOwner(native)[0], anchor = mainMessageAnchor(native);
  const watchCase = 'case`mtk-runtime-json-watch`:MTKstartRuntimeJsonWatch(e,this.windowManager,t.roots);break;';
  const helper = rendererHelper("s"), nativeHelper = mainHelper();
  const applied = renderer.includes(helper) && renderer.includes(after) && native.includes(nativeHelper) && native.includes(watchCase);
  if (!applied) {
    if (["MTKruntimeJson", "MTKinstallRuntimeJsonReload"].some(marker => renderer.includes(marker) || native.includes(marker))) throw new Error("Upstream changed: partial runtime JSON module patch");
    unique(renderer, before); unique(native, anchor); unique(native, logger);
    if (command === "apply") {
      renderer = renderer.replace(before, () => helper + after);
      native = native.replace(logger, () => nativeHelper + logger).replace(anchor, () => watchCase + anchor);
      writeRendererModule(owner, renderer);
      fs.writeFileSync(main, native);
    }
  }
  return {state: applied || command === "apply" ? "applied" : "needs-apply", directory: ".codex", files: ["agent-roster.json"], targets: [owner.file, main].map(file => path.relative(root, file))};
}

function unique(source, contract) {
  if (source.split(contract).length !== 2) throw new Error(`Upstream changed: runtime JSON module contract is not unique: ${contract}`);
}
