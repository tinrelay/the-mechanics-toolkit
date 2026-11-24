import assert from 'node:assert/strict';
import {parse} from 'acorn';
import {readRendererModule} from '../src/renderer-module.mjs';
import {waitOwners30607,waitProfiles30607} from '../patches/wait-thread-roster/profiles/build30607.mjs';
export function probeWait30607(root){
 for(const[index,owner]of waitOwners30607(root).entries()){
  const source=readRendererModule(owner),p=waitProfiles30607[index],ast=parse(source,{ecmaVersion:'latest',sourceType:'module'});
  const helpers=ast.body.filter(x=>x.type==='FunctionDeclaration'&&x.id.name.startsWith('MTK')).map(x=>source.slice(x.start,x.end)).join('');
  const bindings=source.slice(source.indexOf('const MTKwaitStoreHook='),source.indexOf(';',source.indexOf('const MTKwaitStoreHook='))+1);
  const titleAtom={},threadAtom={},dispatched=[];let title='Ada — Coordinator';
  const scope={get(atom,key){assert.deepEqual(key,{hostId:'local',threadId:'ada'});if(atom===titleAtom)return title;if(atom===threadAtom)return{summary:{title,cwd:'/projects/office'}};throw Error('unknown selector')}};
  const makeElement=(type,props,key)=>{assert.ok(typeof type==='function'||typeof type==='string','wait card renders a defined component');return {type,props,key}};
  const jsx={jsx:makeElement,jsxs:makeElement};
  const nativeImports=new Map(ast.body.filter(x=>x.type==='VariableDeclaration').flatMap(x=>x.declarations).filter(x=>x.init?.type==='CallExpression'&&x.init.callee.name===p.loader&&typeof x.init.arguments[0]?.value==='string').map(x=>[x.id.name,x.init.arguments[0].value]));
  const nativeOwners={dqpP:{file:owner.file,id:'dqpP',parameters:['e','t','a']},HOLv:{file:owner.file.replace('990214.12d3fdf6e7.js','972521.6cec9fea8c.js'),id:'HOLv',parameters:['e','t','i']},wbOy:{file:owner.file.replace('990214.12d3fdf6e7.js','49792.ab5b643c25.js'),id:'wbOy',parameters:['e','t','n']},MFk9:{file:owner.file,id:'MFk9',parameters:['e','t','a']}};
  for(const reference of [p.container,p.spinner,p.summaryWrapper]){
   const [local,key]=reference.split('.'),id=nativeImports.get(local),target=nativeOwners[id];assert.ok(target,'current native component owner '+reference);
   const body=readRendererModule(target),nodes=parse(body,{ecmaVersion:'latest',sourceType:'module'}),exports=new Set;
   walk(nodes,n=>{if(n.type==='CallExpression'&&n.callee?.property?.name==='d'&&n.arguments[0]?.name===target.parameters[1])for(const arg of n.arguments.slice(1).filter(x=>x.type==='ObjectExpression'))for(const prop of arg.properties)exports.add(prop.key.name??prop.key.value)});
   assert.ok(exports.has(key),'wait card requires an actual native export: '+id+'.'+key);
  }
  const nativeContainerExports={},loadContainer=id=>({ABep:jsx,QosV:{c:n=>Array(n).fill(Symbol.for('react.memo_cache_sentinel'))},on57:{A:(...x)=>x.filter(Boolean).join(' ')}}[id]??assert.fail('unexpected native container dependency '+id));
  loadContainer.d=(target,getters,values)=>{for(const [key,get]of Object.entries(getters))Object.defineProperty(target,key,{get});Object.assign(target,values)};
  Function('e','t','a',readRendererModule(nativeOwners.dqpP))({},nativeContainerExports,loadContainer);
  assert.equal(typeof nativeContainerExports.F,'function','actual native container is callable');
  const values={[p.jsx]:jsx,[p.container.split('.')[0]]:nativeContainerExports,[p.classNames.match(/,([\w$]+)\./)[1]]:{A:(...x)=>x.filter(Boolean).join(' ')},[p.spinner.split('.')[0]]:{N:'spinner'},[p.summaryWrapper.split('.')[0]]:{o:'summary-wrapper'},[p.normalize.match(/,([\w$]+)\./)[1]]:{JXB:x=>'normalized:'+x,Cv$:x=>'/new/'+x,_RT:x=>'/local/'+x},[p.hostBridge.split('.')[0]]:{O1:{dispatchHostMessage:x=>dispatched.push(x)}},[p.iconFunction]:()=>null};
  const realm={__MTK_PATCH_REGISTRY__:{apiVersion:1,packages:{taskVisualPalette:{version:1,resolveTaskColor:()=> '#22AA44'},crossTaskAttribution:{version:3,resolveTaskLabel:({title})=>title.split(' — ')[0]}}}};
  const imports=id=>({'Q840':{gh:()=>scope},'OWtl':{u:scope},'tl5a':{HX:titleAtom,ok:threadAtom}}[id]??assert.fail('unexpected import '+id));
  const api=Function(p.loader,'globalThis',...Object.keys(values),bindings+helpers+';return {render:MTKWaitThreadRoster,navigate:MTKwaitNavigate};')(imports,realm,...Object.values(values));
  const render=()=>api.render({item:{arguments:{targets:[{hostId:'local',threadId:'ada'}]},completed:true},variant:'row'});
  const collect=node=>node==null?[]:typeof node==='object'?[node,...Object.values(node.props??{}).flatMap(x=>Array.isArray(x)?x.flatMap(collect):collect(x))]:[];
  const card=render();assert.equal(card.type,nativeContainerExports.F);const nativeCard=card.type(card.props);assert.equal(nativeCard.type,'span');assert.equal(nativeCard.props['data-mtk-wait-thread-roster'],true);
  let button=collect(card).find(x=>x.type==='button');assert.equal(button.props.children,'Ada');assert.match(button.props.style.color,/light-dark/);
  button.props.onClick({preventDefault(){},stopPropagation(){}});assert.equal(dispatched[0].path,'/local/normalized:ada');
  title='Renamed — Coordinator';button=collect(render()).find(x=>x.type==='button');assert.equal(button.props.children,'Renamed','uses current title after metadata changes');
  assert.equal(api.render({item:{arguments:{targets:[]}},variant:'row'}),null);
  for(const [completed,success,label]of[[false,true,'Waiting for'],[true,true,'Waited for'],[true,false,'Wait failed for']]){
   const tree=api.render({item:{arguments:{targets:[{hostId:'local',threadId:'ada'}]},completed,success},variant:'row'}),spinner=collect(tree).find(n=>n.type==='spinner');assert.equal(spinner.props.active,!completed);assert.equal(spinner.props.children,label);
   const target=collect(tree).find(n=>n.type==='button');assert.equal(target.props.style.WebkitTextFillColor,target.props.style.color,'identity text keeps its own paint color inside native running shimmer');
   const summarized=api.render({item:{arguments:{targets:[{hostId:'local',threadId:'ada'}]},completed,success},variant:'row',agentActivityIcon:'native-icon'});assert.equal(summarized.type,'summary-wrapper');assert.equal(summarized.props.summary.type,nativeContainerExports.F);
  }
  realm.__MTK_PATCH_REGISTRY__.packages.taskVisualPalette.resolveTaskColor=()=>null;
  assert.equal(collect(render()).find(n=>n.type==='button').props.style,undefined,'removing the palette clears both text color properties');
 }
 console.log('wait-thread roster 30607 behavior probe passed');
}
function walk(n,f){if(!n||typeof n!=='object')return;if(n.type)f(n);for(const v of Object.values(n))if(Array.isArray(v))v.forEach(x=>walk(x,f));else if(v&&typeof v==='object')walk(v,f)}
