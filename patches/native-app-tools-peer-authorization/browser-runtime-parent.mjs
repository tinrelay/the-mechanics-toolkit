// Retain the packaged Node process as the browser REPL's immediate parent. The Chrome host's
// existing vendor-identity checks can then succeed with a locally rebuilt Codex grandparent.
export const browserRuntimeParentSource = `
import {spawn} from "node:child_process";
process.env.BROWSER_USE_ACCESS_EXECUTOR_ID ??= "";
const child = spawn(process.argv[1], process.argv.slice(2), {stdio: "inherit"});
child.once("error", error => { console.error(error.message); process.exit(1); });
child.once("exit", (code, signal) => {
  if (signal) { process.removeAllListeners(signal); process.kill(process.pid, signal); }
  else process.exit(code ?? 1);
});
for (const signal of ["SIGTERM", "SIGINT", "SIGHUP"]) {
  process.on(signal, () => child.kill(signal));
}
`;

export function browserRuntimeReplacements({ownerName="r3", nodePath="es.wLF",newLayout=false} = {}) {
  const owner = newLayout ? `function ${ownerName}({browserBackends:e,deferTools:t,omitCuaConfirmationPolicyBySku:r,surfaces:n,nodeRepl:i,accessBootstrapPath:s}){` : `function ${ownerName}({browserBackends:e,deferTools:t,surfaces:r,nodeRepl:n,accessBootstrapPath:i}){`;
  const stock = '...null==i?{}:{command:"/bin/sh",args:["-c",\'export BROWSER_USE_ACCESS_EXECUTOR_ID="${BROWSER_USE_ACCESS_EXECUTOR_ID-}"; exec "$@"\',"cua-repl",n.command,...n.args]},env:function';
  const helper = 'function MTKbrowserRuntimeLaunch(e,t){if("darwin"!==process.platform)return null==t?{}:{command:"/bin/sh",args:["-c",\'export BROWSER_USE_ACCESS_EXECUTOR_ID="${BROWSER_USE_ACCESS_EXECUTOR_ID-}"; exec "$@"\',"cua-repl",e.command,...e.args]};if(!e.env[es.wLF])throw Error("Missing packaged browser Node runtime");return{command:e.env[es.wLF],args:["--input-type=module","-e",' +
    JSON.stringify(browserRuntimeParentSource) + ',e.command,...e.args]}}';
  const selectedStock=newLayout?stock.replace("...null==i?", "...null==s?").replace("n.command,...n.args", "i.command,...i.args"):stock;
  return [[owner, helper.replaceAll('es.wLF',nodePath) + owner], [selectedStock, newLayout ? '...MTKbrowserRuntimeLaunch(i,s),env:function' : '...MTKbrowserRuntimeLaunch(n,i),env:function']];
}
