import assert from "node:assert/strict";
import {parse} from "acorn";
import path from "node:path";
import {readRendererModule} from "../src/renderer-module.mjs";
import {paletteOwners30607} from "../patches/task-visual-palette/profiles/build30607.mjs";

export function probePendingChatArchive30607(root) {
  const footer=readRendererModule({file:path.join(root,'webview/assets/async/632620.3703d3cbed.js'),id:'Gjet',parameters:['e','t','r']}),footerNodes=[];
  walk(parse(footer,{ecmaVersion:'latest',sourceType:'module'}),node=>{if(node.type==='ObjectExpression'&&node.properties.some(p=>p.key?.name==='className'&&footer.slice(p.value.start,p.value.end).includes('footer-A8ZvKV')))footerNodes.push(node)});
  assert.equal(footerNodes.length,1,'one native composer footer owns the pseudo-element backdrop');
  const marker=footerNodes[0].properties.find(p=>p.key?.value==='data-mtk-palette-bottom-fade');
  assert.ok(marker,'the active composer footer participates in room-color styling');
  assert.equal(Function('return '+footer.slice(marker.value.start,marker.value.end))(),true);
  const group=readRendererModule(paletteOwners30607(root).group),groupNodes=[];
  walk(parse(group,{ecmaVersion:"latest",sourceType:"module"}),node=>groupNodes.push(node));
  const groupAction=groupNodes.find(node=>node.type==="FunctionExpression"&&node.params[0]?.type==="ObjectPattern"&&
    node.params[0].properties.some(property=>property.key.name==="selectedThreadKeys"));
  assert.ok(groupAction);
  let guard=true;
  const menuAction=Function("globalThis","return ("+group.slice(groupAction.start,groupAction.end)+")")({
    __MTKsidebarArchiveProtected:id=>{assert.equal(id,"protected-task");return guard}
  });
  const items=[{id:"rename-thread"},{id:"archive-thread"},{id:"archive-task"},{id:"delete-thread"}];
  const selection={items,selectedThreadKeys:["protected-task"]};
  assert.deepEqual(menuAction(selection).map(item=>item.id),["rename-thread"]);
  guard=false;
  assert.equal(menuAction(selection),items,"ordinary single selections keep native menu items");
  const bulkCalls=[];
  let bulkProtected=true;
  const mixedMenu=Function("globalThis","v","c","r","o","i","return ("+group.slice(groupAction.start,groupAction.end)+")")({
    __MTKsidebarArchiveProtected:id=>bulkProtected&&id==="protected-task"
  },new Set(["pin-thread"]),{
    r4:(_get,keys)=>keys.map(id=>({kind:"local",conversationId:id,hostId:"local",workspaceKind:"projectless"}))
  },{x:"eligible",C:(...args)=>bulkCalls.push(args)},{N:()=>false},{fI:"local"});
  const bulkScope={get:()=>true},bulkSelection={...selection,scope:bulkScope,
    items:[{id:"pin-thread"},...items.slice(1)],selectedThreadKeys:["ordinary-task","protected-task"]};
  assert.deepEqual(mixedMenu(bulkSelection).map(item=>item.id),["pin-thread"],
    "a protected member removes destructive bulk actions");
  bulkProtected=false;
  const bulkNative=mixedMenu(bulkSelection);
  assert.deepEqual(bulkNative.map(item=>item.id),["pin-thread","lifecycle-separator","archive-thread","delete-thread"]);
  bulkNative.at(-1).onSelect();
  assert.deepEqual(bulkCalls.pop(),[bulkScope,[
    {hostId:"local",threadId:"ordinary-task"},{hostId:"local",threadId:"protected-task"}
  ],{returnFocusTo:undefined}],"unprotected selections retain native bulk deletion");

  let protectedTask=true;
  const nativeMenu=readRendererModule(paletteOwners30607(root).menus[0]),nativeNodes=[];
  walk(parse(nativeMenu,{ecmaVersion:"latest",sourceType:"module"}),node=>nativeNodes.push(node));
  const deletion=nativeNodes.filter(node=>node.type==="ExpressionStatement"&&
    node.expression.type==="LogicalExpression"&&nativeMenu.slice(node.start,node.end).includes('eK.push({id:"delete-thread"'));
  assert.equal(deletion.length,1,"one shared sidebar/title-menu owner offers permanent deletion");
  const offerDelete=Function("globalThis","V","eA","e","x","ek","eM","eK","ew","document",
    nativeMenu.slice(deletion[0].start,deletion[0].end));
  const scope={},calls=[],focus={},key=Symbol("deletion-eligibility");
  const native={x:key,C:(...args)=>calls.push(args)};
  let eligible=true;
  scope.get=(atom,target)=>{assert.equal(atom,key);assert.deepEqual(target,{hostId:"local",threadId:"protected-task"});return eligible};
  for(const [surface,titleMenu]of[["sidebar",false],["header",true]]){
    const entries=[];
    protectedTask=true;
    offerDelete({__MTKsidebarArchiveProtected:()=>protectedTask},surface,titleMenu,scope,native,"local","protected-task",entries,focus,{});
    assert.deepEqual(entries,[],"protected chats omit permanent deletion");
    protectedTask=false;
    offerDelete({__MTKsidebarArchiveProtected:()=>protectedTask},surface,titleMenu,scope,native,"local","protected-task",entries,focus,{});
    assert.equal(entries.length,1,"removing protection restores the native menu action");
    assert.equal(entries[0].id,"delete-thread");
    entries[0].onSelect();
    assert.deepEqual(calls.pop(),[scope,[{hostId:"local",threadId:"protected-task"}],{returnFocusTo:focus}]);
    eligible=false;entries.length=0;
    offerDelete({__MTKsidebarArchiveProtected:()=>false},surface,titleMenu,scope,native,"local","protected-task",entries,focus,{});
    assert.deepEqual(entries,[],"native deletion eligibility is preserved");
    eligible=true;
  }
  const source=readRendererModule(paletteOwners30607(root).localMenu);
  const nodes=[];
  walk(parse(source,{ecmaVersion:"latest",sourceType:"module"}),node=>nodes.push(node));
  const menu=nodes.find(node=>node.type==="ArrowFunctionExpression"&&source.slice(node.start,node.end).includes('MTKsidebarArchiveProtected(Y)'));
  assert.ok(menu,"pending-chat menu tests the native clientThreadId");
  protectedTask=true;
  const action=()=>{};
  const render=Function("MTKsidebarArchiveProtected","Y","Z","f","ee","et","g","b","eo","er","return ("+source.slice(menu.start,menu.end)+")")(
    id=>{assert.equal(id,"native-task-id");return protectedTask},"native-task-id",true,
    {$J:()=>({id:"pin-thread"})},false,action,{tD:{renameThread:"Rename",archiveThread:"Archive"}},{UT:{renameThread:"Rename",archiveThread:"Archive"}},action,action
  );
  assert.deepEqual(render().map(item=>item.id),["pin-thread","rename-thread"]);
  protectedTask=false;
  assert.deepEqual(render().map(item=>item.id),["pin-thread","rename-thread","archive-task"]);
  assert.equal(render().at(-1).onSelect,action,"unprotected chats retain their native archive action");
  const invalidation=nodes.find(node=>node.type==="VariableDeclarator"&&node.id.name==="MTKarchiveCache");
  assert.ok(invalidation);
  const invalidate=Function("K","MTKarchiveEpoch","return ("+source.slice(invalidation.init.start,invalidation.init.end)+")");
  const cache=Array(82).fill("cached");cache[81]=1;
  invalidate(cache,1);assert.equal(cache[0],"cached");
  invalidate(cache,2);assert.equal(cache[0],Symbol.for("react.memo_cache_sentinel"));assert.equal(cache[81],2);
  const remote=readRendererModule(paletteOwners30607(root).remoteActions),remoteNodes=[];
  walk(parse(remote,{ecmaVersion:"latest",sourceType:"module"}),node=>remoteNodes.push(node));
  const archiveValues=remoteNodes.filter(node=>node.type==="Property"&&node.key.name==="archive"&&
    remote.slice(node.value.start,node.value.end).includes('MTKsidebarArchiveProtected(tf??ev.key)'));
  assert.equal(archiveValues.length,1,"unified entry action guards its native conversation or entry key");
  for(const node of archiveValues){
    const value=Function("tf","ev","MTKsidebarArchiveProtected","t",
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
