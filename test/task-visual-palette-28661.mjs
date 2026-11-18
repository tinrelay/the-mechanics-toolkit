import assert from "node:assert/strict";
import {parse} from "acorn";
import {readRendererModule} from "../src/renderer-module.mjs";
import {paletteOwners28661} from "../patches/task-visual-palette/profiles/build28661.mjs";

export function probePendingChatArchive28661(root) {
  const group=readRendererModule(paletteOwners28661(root).group),groupNodes=[];
  walk(parse(group,{ecmaVersion:"latest",sourceType:"module"}),node=>groupNodes.push(node));
  const groupAction=groupNodes.find(node=>node.type==="FunctionExpression"&&node.params[0]?.type==="ObjectPattern"&&
    node.params[0].properties.some(property=>property.key.name==="selectedThreadKeys"));
  assert.ok(groupAction);
  let guard=true;
  const menuAction=Function("globalThis","return ("+group.slice(groupAction.start,groupAction.end)+")")({
    __MTKsidebarArchiveProtected:id=>{assert.equal(id,"protected-task");return guard}
  });
  const items=[{id:"rename-thread"},{id:"archive-thread"},{id:"archive-task"}];
  const selection={items,selectedThreadKeys:["protected-task"]};
  assert.deepEqual(menuAction(selection).map(item=>item.id),["rename-thread"]);
  guard=false;
  assert.equal(menuAction(selection),items,"ordinary single selections keep native menu items");
  const source=readRendererModule(paletteOwners28661(root).localMenu);
  const nodes=[];
  walk(parse(source,{ecmaVersion:"latest",sourceType:"module"}),node=>nodes.push(node));
  const menu=nodes.find(node=>node.type==="ArrowFunctionExpression"&&source.slice(node.start,node.end).includes('MTKsidebarArchiveProtected(J)'));
  assert.ok(menu,"pending-chat menu tests the native clientThreadId");
  let protectedTask=true;
  const action=()=>{};
  const render=Function("MTKsidebarArchiveProtected","J","G","f","Y","ee","v","eo","ea","return ("+source.slice(menu.start,menu.end)+")")(
    id=>{assert.equal(id,"native-task-id");return protectedTask},"native-task-id",true,
    {$J:()=>({id:"pin-thread"})},false,action,{tD:{renameThread:"Rename",archiveThread:"Archive"}},action,action
  );
  assert.deepEqual(render().map(item=>item.id),["pin-thread","rename-thread"]);
  protectedTask=false;
  assert.deepEqual(render().map(item=>item.id),["pin-thread","rename-thread","archive-task"]);
  assert.equal(render().at(-1).onSelect,action,"unprotected chats retain their native archive action");
  const invalidation=nodes.find(node=>node.type==="VariableDeclarator"&&node.id.name==="MTKarchiveCache");
  assert.ok(invalidation);
  const invalidate=Function("F","MTKarchiveEpoch","return ("+source.slice(invalidation.init.start,invalidation.init.end)+")");
  const cache=Array(82).fill("cached");cache[81]=1;
  invalidate(cache,1);assert.equal(cache[0],"cached");
  invalidate(cache,2);assert.equal(cache[0],Symbol.for("react.memo_cache_sentinel"));assert.equal(cache[81],2);
  const remote=readRendererModule(paletteOwners28661(root).remoteActions),remoteNodes=[];
  walk(parse(remote,{ecmaVersion:"latest",sourceType:"module"}),node=>remoteNodes.push(node));
  const archiveValues=remoteNodes.filter(node=>node.type==="Property"&&node.key.name==="archive"&&
    remote.slice(node.value.start,node.value.end).includes('MTKsidebarArchiveProtected(tp??ev.key)'));
  assert.equal(archiveValues.length,1,"unified entry action guards its native conversation or entry key");
  for(const node of archiveValues){
    const value=Function("tp","ev","MTKsidebarArchiveProtected","t",
      "return ("+remote.slice(node.value.start,node.value.end)+")");
    for(const id of ["native-task-id",null]){
      const protectedTask=key=>{assert.equal(key,id??"native-entry-key");return true};
      assert.equal(value(id,{key:"native-entry-key"},protectedTask,action),null);
      assert.equal(value(id,{key:"native-entry-key"},()=>false,action),action,
        "ordinary entries retain the native archive callback");
    }
  }
}
function walk(node,visit){if(!node||typeof node!=="object")return;if(node.type)visit(node);for(const value of Object.values(node))if(Array.isArray(value))value.forEach(child=>walk(child,visit));else if(value&&typeof value==="object")walk(value,visit)}
