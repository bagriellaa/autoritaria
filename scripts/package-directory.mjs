import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),target=path.join(root,'release','Autoritaria');
if(!fs.existsSync(path.join(root,'dist','index.html')))throw new Error('Execute npm run build primeiro.');
function put(source,destination){fs.mkdirSync(path.dirname(destination),{recursive:true});if(fs.existsSync(destination)){if(fs.statSync(source).ino===fs.statSync(destination).ino)return;fs.unlinkSync(destination);}try{fs.linkSync(source,destination);}catch{fs.copyFileSync(source,destination);}}
function tree(source,destination,skip=[]){for(const e of fs.readdirSync(source,{withFileTypes:true})){if(skip.includes(e.name))continue;const a=path.join(source,e.name),b=path.join(destination,e.name);if(e.isDirectory())tree(a,b,skip);else put(a,b);}}
tree(path.join(root,'node_modules','electron','dist'),target,['electron.exe','default_app.asar']);
put(path.join(root,'node_modules','electron','dist','electron.exe'),path.join(target,'Autoritaria.exe'));
const app=path.join(target,'resources','app');
tree(path.join(root,'docs'),path.join(target,'Docs'));
tree(path.join(root,'dist'),path.join(app,'dist'));tree(path.join(root,'desktop'),path.join(app,'desktop'));
fs.writeFileSync(path.join(app,'package.json'),JSON.stringify({name:'autoritaria',version:'0.2.0',main:'desktop/main.cjs'}));
put(path.join(root,'README.md'),path.join(target,'LEIA-ME.md'));
put(path.join(root,'THIRD_PARTY_NOTICES.md'),path.join(target,'THIRD_PARTY_NOTICES.md'));
for(const [source,name] of [['node_modules/three/LICENSE','THREE-LICENSE.txt'],['node_modules/electron/LICENSE','ELECTRON-LICENSE.txt']])if(fs.existsSync(path.join(root,source)))put(path.join(root,source),path.join(target,name));
for(const [source,name] of [['node_modules/inkjs/LICENSE.md','INKJS-LICENSE.txt'],['node_modules/yuka/LICENSE','YUKA-LICENSE.txt']])if(fs.existsSync(path.join(root,source)))put(path.join(root,source),path.join(target,name));
console.log('Aplicativo local pronto: '+path.join(target,'Autoritaria.exe'));
console.log('Para transferir, copie a pasta Autoritaria inteira. Arquivos vinculados fisicamente economizam espaço neste volume; a cópia normal é independente.');
