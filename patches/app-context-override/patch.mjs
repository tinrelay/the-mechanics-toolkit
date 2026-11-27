#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {matchesBuild30866} from '../runtime-json-reload/profiles/build30866.mjs';
import {mainProcessAsset} from '../../src/main-process-asset.mjs';
import {instructionAsset,transformInstructions,readyBefore,readyAfter} from './transform.mjs';

const [command,argument]=process.argv.slice(2);
if(!['check','apply'].includes(command)||!argument)throw Error('usage: app-context-override/patch.mjs check|apply EXTRACTED_ASAR_ROOT');
const root=path.resolve(argument);
if(!matchesBuild30866(root))throw Error('Unsupported Desktop identity for app-context-override');
const file=path.join(root,instructionAsset),main=mainProcessAsset(root);
const result=transformInstructions(fs.readFileSync(file,'utf8')),native=fs.readFileSync(main,'utf8');
const applied=native.split(readyAfter).length===2;
if(native.split(readyBefore).length!==2||native.includes('MTKcheckAppContextDefaults')!==applied)throw Error('Upstream changed: app-context launch notice owner');
if((result.state==='applied')!==applied)throw Error('Partial app-context override');
if(command==='apply'&&!applied){fs.writeFileSync(file,result.source);fs.writeFileSync(main,native.replace(readyBefore,()=>readyAfter))}
console.log(JSON.stringify({state:command==='apply'?'applied':result.state,targets:[instructionAsset,path.relative(root,main)],defaultsFingerprint:result.fingerprint,override:'app-context.md',defaultSnapshot:'app-context.default.md'}));
