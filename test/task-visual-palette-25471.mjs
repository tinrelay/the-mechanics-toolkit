import assert from "node:assert/strict";
import {parse} from "acorn";
import {readRendererModule} from "../src/renderer-module.mjs";
import {paletteOwners25471} from "../patches/task-visual-palette/profiles/build25471.mjs";

export function probePendingChatArchive25471(root) {
  const source=readRendererModule(paletteOwners25471(root).localMenu);
  const nodes=[];
  walk(parse(source,{ecmaVersion:"latest",sourceType:"module"}),node=>nodes.push(node));
  const menu=nodes.find(node=>node.type==="ArrowFunctionExpression"&&source.slice(node.start,node.end).includes('MTKsidebarArchiveProtected(J)'));
  assert.ok(menu,"pending-chat menu tests the native clientThreadId");
  let protectedTask=true;
  const action=()=>{};
  const render=Function("MTKsidebarArchiveProtected","J","Z","f","ee","et","v","ei","er","return ("+source.slice(menu.start,menu.end)+")")(
    id=>{assert.equal(id,"native-task-id");return protectedTask},"native-task-id",true,
    {$J:()=>({id:"pin-thread"})},false,action,{tD:{renameThread:"Rename",archiveThread:"Archive"}},action,action
  );
  assert.deepEqual(render().map(item=>item.id),["pin-thread","rename-thread"]);
  protectedTask=false;
  assert.deepEqual(render().map(item=>item.id),["pin-thread","rename-thread","archive-task"]);
  assert.equal(render().at(-1).onSelect,action,"unprotected chats retain their native archive action");
  const invalidation=nodes.find(node=>node.type==="VariableDeclarator"&&node.id.name==="MTKarchiveCache");
  assert.ok(invalidation);
  const invalidate=Function("K","MTKarchiveEpoch","return ("+source.slice(invalidation.init.start,invalidation.init.end)+")");
  const cache=Array(86).fill("cached");cache[85]=1;
  invalidate(cache,1);assert.equal(cache[0],"cached");
  invalidate(cache,2);assert.equal(cache[0],Symbol.for("react.memo_cache_sentinel"));assert.equal(cache[85],2);
}
function walk(node,visit){if(!node||typeof node!=="object")return;if(node.type)visit(node);for(const value of Object.values(node))if(Array.isArray(value))value.forEach(child=>walk(child,visit));else if(value&&typeof value==="object")walk(value,visit)}
