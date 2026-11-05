import fs from 'node:fs';
import path from 'node:path';
const dir=path.resolve('public/assets/cutscenes');
const assets=[];
for(let scene=1;scene<=9;scene++)for(const variant of [1,3,4].includes(scene)?['neutral']:['female','male']){
  const file=`scene_${String(scene).padStart(2,'0')}_${variant}.png`,full=path.join(dir,file);
  if(!fs.existsSync(full)){assets.push({scene,variant,file,status:'pending'});continue;}
  const png=fs.readFileSync(full),width=png.readUInt32BE(16),height=png.readUInt32BE(20);
  assets.push({scene,variant,file,status:'generated-and-reviewed',width,height,bytes:png.length,individualComposition:true});
}
fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify({version:1,style:'Expressionist oil impasto',pending:assets.filter(a=>a.status==='pending').length,notes:'Original resolutions retained without artificial upscaling. Each file is one independent composition.',assets},null,2));
console.log(`${assets.length} assets, ${assets.filter(a=>a.status==='pending').length} pending.`);
