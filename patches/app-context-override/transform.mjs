import {parse} from 'acorn';
import {createHash} from 'node:crypto';

export const instructionAsset='.vite/build/early-bootstrap-7-ce4a67f0257ee973.js';
const expressionBefore='${f.trim()}';
const expressionAfter='${MTKappContextFromFile(h?(0,rV.W_)(f.trim()):f.trim())}';
const returnBefore='E=rX(r??"",_);return h?(0,rV.W_)(E):E';
const returnAfter='E=rX(h?(0,rV.W_)(r??""):r??"",_);return E';
export const readyBefore='await tg.app.whenReady(),';
export const readyAfter='await tg.app.whenReady(),tI.MTKcheckAppContextDefaults(tg.dialog),';

export function instructionOwner(source){
  const tree=parse(source,{ecmaVersion:'latest',sourceType:'module'});
  const expressions=tree.body.filter(n=>n.type==='ExpressionStatement').flatMap(n=>n.expression.type==='SequenceExpression'?n.expression.expressions:[n.expression]);
  const registries=expressions.filter(n=>n.type==='AssignmentExpression'&&n.left.type==='MemberExpression'&&n.left.object.name==='exports'&&n.left.property.name==='modules').map(n=>n.right);
  const properties=registries.flatMap(n=>n.type==='ObjectExpression'?n.properties:[]);
  const owners=properties.filter(n=>n.key.value===73488);
  if(registries.length!==1||owners.length!==1||owners[0].value.type!=='FunctionExpression')throw Error('Upstream changed: native instruction owner is not unique');
  const owner=owners[0].value;
  if(owner.params.map(n=>n.name).join(',')!=='e,t,r')throw Error('Upstream changed: instruction owner parameters');
  const body=source.slice(owner.body.start+1,owner.body.end-1);
  for(const marker of ['eUd:()=>r0,IzQ:()=>r1','_=r(34338)','var P=r(78335),N=r.n(P),x=r(89477),D=r(86697)','e?rq:null'])one(body,marker);
  return{owner,body,properties};
}

// Only instruction text participates: ordinary minifier renaming does not trigger an alert.
export function instructionFingerprint(source){
  const {owner,properties}=instructionOwner(source),nodes=owner.body.body;
  const vars=new Map(nodes.filter(n=>n.type==='VariableDeclaration').flatMap(n=>n.declarations).map(n=>[n.id.name,n.init]));
  const selected=['rK','r$','rq','rz','rQ','rJ','rZ'].map(name=>{const node=vars.get(name);if(!node)throw Error('Upstream changed: missing instruction section '+name);return node});
  const builder=nodes.find(n=>n.type==='FunctionDeclaration'&&n.id?.name==='r0');
  if(!builder)throw Error('Upstream changed: missing instruction builder');
  selected.push(builder);
  for(const id of [39879,71530]){const matches=properties.filter(p=>p.key.value===id);if(matches.length!==1)throw Error('Upstream changed: instruction dependency '+id);selected.push(matches[0].value)}
  const values=[];
  function visit(n){if(!n||typeof n!=='object')return;if(n.type==='Literal'&&typeof n.value==='string')values.push(n.value);if(n.type==='TemplateElement')values.push(n.value.cooked??n.value.raw);for(const v of Object.values(n))Array.isArray(v)?v.forEach(visit):typeof v==='object'&&visit(v)}
  selected.forEach(visit);
  return createHash('sha256').update(JSON.stringify(values)).digest('hex');
}

export function runtimeHelper(fingerprint){
  return `function MTKappContextWrite(e,t){let r;try{r=x.readFileSync(e,"utf8")}catch(e){if(e.code!=="ENOENT")throw e}if(r!==t){x.mkdirSync(D.dirname(e),{recursive:!0,mode:448});x.writeFileSync(e,t,{mode:384})}}function MTKappContextFromFile(e){const t=(0,_.D)(),r=D.join(t,"app-context.md");try{MTKappContextWrite(D.join(t,"app-context.default.md"),e)}catch(e){console.warn("[TMTK] Cannot refresh default app context",e.message)}try{return x.readFileSync(r,"utf8")}catch(t){if(t.code==="ENOENT")return e;throw Error("Cannot read app-context override: "+r,{cause:t})}}async function MTKcheckAppContextDefaults(e){try{const t=D.join((0,_.D)(),"app-context.state.json"),r=${JSON.stringify(fingerprint)};let n;try{n=JSON.parse(x.readFileSync(t,"utf8"))}catch(e){if(e.code!=="ENOENT"&&!(e instanceof SyntaxError))throw e}const i=()=>MTKappContextWrite(t,JSON.stringify({version:1,defaultsFingerprint:r})+"\\n");if(n?.version!==1||typeof n.defaultsFingerprint!=="string")return i();if(n.defaultsFingerprint===r)return;await e.showMessageBox({type:"info",title:"App instructions changed",message:"App instructions changed",detail:"The app's bundled instructions have changed. Your custom app-context file has not been modified.",buttons:["OK"]});i()}catch(e){console.warn("[TMTK] Cannot check app instruction updates",e.message)}}r.d(t,{MTKcheckAppContextDefaults:()=>MTKcheckAppContextDefaults});`;
}

export function transformInstructions(source){
  const {owner,body}=instructionOwner(source);
  if(body.includes('function MTKappContextFromFile(')){
    // Fingerprint the original builder, not the override's own strings.
    const original=body.replace(expressionAfter,expressionBefore).replace(returnAfter,returnBefore);
    const start=original.indexOf('function MTKappContextWrite(');
    if(start<0)throw Error('Partial app-context override');
    const restored=source.slice(0,owner.body.start+1)+original.slice(0,start)+source.slice(owner.body.end-1);
    const helper=runtimeHelper(instructionFingerprint(restored));
    for(const marker of [expressionAfter,returnAfter,helper])one(body,marker);
    return{state:'applied',source,fingerprint:instructionFingerprint(restored)};
  }
  if(body.includes('MTKappContext'))throw Error('Partial app-context override');
  one(body,expressionBefore);one(body,returnBefore);
  const fingerprint=instructionFingerprint(source);
  const changed=body.replace(expressionBefore,()=>expressionAfter).replace(returnBefore,()=>returnAfter)+runtimeHelper(fingerprint);
  return{state:'needs-apply',source:source.slice(0,owner.body.start+1)+changed+source.slice(owner.body.end-1),fingerprint};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: app-context contract '+v.slice(0,100))}
