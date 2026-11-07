import assert from 'node:assert/strict';
import {parse} from 'acorn';
import {readRendererModule} from '../src/renderer-module.mjs';
import {waitOwners25471,waitProfiles25471} from '../patches/wait-thread-roster/profiles/build25471.mjs';
export function probeWait25471(root){
 for(const[index,owner]of waitOwners25471(root).entries()){
  const source=readRendererModule(owner),p=waitProfiles25471[index],ast=parse(source,{ecmaVersion:'latest',sourceType:'module'});
  const helpers=ast.body.filter(x=>x.type==='FunctionDeclaration'&&x.id.name.startsWith('MTK')).map(x=>source.slice(x.start,x.end)).join('');
  const bindings=source.slice(source.indexOf('const MTKwaitStoreHook='),source.indexOf(';',source.indexOf('const MTKwaitStoreHook='))+1);
  const titleAtom={},threadAtom={},dispatched=[];let title='Ada — Coordinator';
  const scope={get(atom,key){assert.deepEqual(key,{hostId:'local',threadId:'ada'});if(atom===titleAtom)return title;if(atom===threadAtom)return{summary:{title,cwd:'/projects/office'}};throw Error('unknown selector')}};
  const jsx={jsx:(type,props,key)=>({type,props,key}),jsxs:(type,props,key)=>({type,props,key})};
  const values={[p.jsx]:jsx,[p.container.split('.')[0]]:{F:'container'},[p.classNames.match(/,([\w$]+)\./)[1]]:{A:(...x)=>x.filter(Boolean).join(' ')},[p.spinner.split('.')[0]]:{N:'spinner'},[p.summaryWrapper.split('.')[0]]:{o:'summary-wrapper'},[p.normalize.match(/,([\w$]+)\./)[1]]:{JXB:x=>'normalized:'+x,Cv$:x=>'/new/'+x,_RT:x=>'/local/'+x},[p.hostBridge.split('.')[0]]:{O1:{dispatchHostMessage:x=>dispatched.push(x)}},[p.routeFlag.match(/,([\w$]+)\./)[1]]:{OX:()=>false},[p.iconFunction]:()=>null};
  const realm={__MTK_PATCH_REGISTRY__:{apiVersion:1,packages:{taskVisualPalette:{version:1,resolveTaskColor:()=> '#22AA44'},crossTaskAttribution:{version:3,resolveTaskLabel:({title})=>title.split(' — ')[0]}}}};
  const imports=id=>({'zTeN':{gh:()=>scope},'OWtl':{u:scope},'tl5a':{HX:titleAtom,ok:threadAtom}}[id]??assert.fail('unexpected import '+id));
  const api=Function(p.loader,'globalThis',...Object.keys(values),bindings+helpers+';return {render:MTKWaitThreadRoster,navigate:MTKwaitNavigate};')(imports,realm,...Object.values(values));
  const render=()=>api.render({item:{arguments:{targets:[{hostId:'local',threadId:'ada'}]},completed:true},variant:'row'});
  const collect=node=>node==null?[]:typeof node==='object'?[node,...Object.values(node.props??{}).flatMap(x=>Array.isArray(x)?x.flatMap(collect):collect(x))]:[];
  let button=collect(render()).find(x=>x.type==='button');assert.equal(button.props.children,'Ada');assert.match(button.props.style.color,/light-dark/);
  button.props.onClick({preventDefault(){},stopPropagation(){}});assert.equal(dispatched[0].path,'/local/normalized:ada');
  title='Renamed — Coordinator';button=collect(render()).find(x=>x.type==='button');assert.equal(button.props.children,'Renamed','uses current title after metadata changes');
  assert.equal(api.render({item:{arguments:{targets:[]}},variant:'row'}),null);
 }
 console.log('wait-thread roster 25471 behavior probe passed');
}
