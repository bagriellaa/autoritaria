import fs from 'node:fs';
import path from 'node:path';
import { Box3, Matrix4, Vector3, Quaternion } from 'three';
const root='public/assets/vendor/kenney';
const results=[];
for(const name of fs.readdirSync(root).filter(n=>n.endsWith('.glb'))){
  const bytes=fs.readFileSync(path.join(root,name));
  const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
  const bounds=new Box3();
  const visit=(id,parent)=>{
    const n=json.nodes[id],matrix=n.matrix?new Matrix4().fromArray(n.matrix):new Matrix4().compose(new Vector3().fromArray(n.translation||[0,0,0]),new Quaternion().fromArray(n.rotation||[0,0,0,1]),new Vector3().fromArray(n.scale||[1,1,1]));
    const world=parent.clone().multiply(matrix);
    if(n.mesh!==undefined)for(const p of json.meshes[n.mesh].primitives){const a=json.accessors[p.attributes.POSITION];if(a.min&&a.max)bounds.union(new Box3(new Vector3().fromArray(a.min),new Vector3().fromArray(a.max)).applyMatrix4(world));}
    for(const child of n.children||[])visit(child,world);
  };
  for(const n of json.scenes[json.scene||0].nodes)visit(n,new Matrix4());
  results.push({file:name,bytes:bytes.length,dimensions:bounds.getSize(new Vector3()).toArray(),min:bounds.min.toArray(),max:bounds.max.toArray(),animations:(json.animations||[]).map(a=>a.name),skins:json.skins?.length||0,externalImages:(json.images||[]).filter(i=>i.uri).map(i=>i.uri),textureEmbedded:(json.images||[]).every(i=>i.bufferView!==undefined),nodes:json.nodes.map(n=>n.name).filter(Boolean)});
}
fs.writeFileSync('public/assets/vendor/model-metadata.json',JSON.stringify(results,null,2));
for(const r of results)console.log(r.file+' '+r.dimensions.map(n=>n.toFixed(3)).join(' × ')+' | '+r.animations.length+' animations');
