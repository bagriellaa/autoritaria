import * as T from 'three';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';
export class AssetLibrary {
  private files=new Map<string,GLTF>();
  async load(names:string[]) {
    const loader=new GLTFLoader();
    await Promise.all(names.map(async name=>{try{this.files.set(name,await loader.loadAsync(`assets/vendor/kenney/${name}.glb`));}catch(e){console.warn(`Asset ${name} unavailable; using local fallback.`,e);}}));
  }
  has(name:string){return this.files.has(name);}
  create(name:string,size:number,byHeight=false):T.Group|null {
    const source=this.files.get(name);if(!source)return null;
    const object=clone(source.scene);object.updateMatrixWorld(true);
    const box=new T.Box3().setFromObject(object),dims=box.getSize(new T.Vector3());
    const scale=size/(byHeight?dims.y:Math.max(dims.x,dims.y,dims.z));
    const holder=new T.Group();holder.add(object);holder.scale.setScalar(scale);
    object.position.x-=(box.min.x+box.max.x)/2;object.position.z-=(box.min.z+box.max.z)/2;object.position.y-=box.min.y;
    object.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;o.geometry=o.geometry.clone();const sourceMaterials=Array.isArray(o.material)?o.material:[o.material];const materials=sourceMaterials.map(material=>{const m=material instanceof T.MeshBasicMaterial?new T.MeshStandardMaterial({color:material.color,map:material.map,transparent:material.transparent,opacity:material.opacity,side:material.side,alphaTest:material.alphaTest}):material.clone();if(m instanceof T.MeshStandardMaterial){m.roughness=.88;m.metalness=0;if(m.map){m.map.magFilter=T.NearestFilter;}}return m;});o.material=Array.isArray(o.material)?materials:materials[0];}});
    if(source.animations.length){const mixer=new T.AnimationMixer(object);holder.userData.mixer=mixer;holder.userData.clips=source.animations;}
    holder.userData.asset=name;return holder;
  }
  animate(group:T.Group,walking:boolean,dt:number){const mixer=group.userData.mixer as T.AnimationMixer|undefined;if(!mixer)return;const clips=group.userData.clips as T.AnimationClip[];const name=walking?'walk':'idle';if(group.userData.actionName!==name){const clip=clips.find(c=>c.name.toLowerCase()===name)||clips.find(c=>c.name.toLowerCase().includes(name));if(clip){const next=mixer.clipAction(clip);const previous=group.userData.animationAction as T.AnimationAction|undefined;next.reset().fadeIn(.22).play();previous?.fadeOut(.22);group.userData.animationAction=next;group.userData.actionName=name;}}mixer.update(dt);}
}
export const ASSETS=['food-kit-loaf','food-kit-carton','food-kit-can','food-kit-bag','food-kit-apple','food-kit-pear','food-kit-carrot','food-kit-bottle-oil','food-kit-honey','food-kit-barrel','food-kit-mug','furniture-kit-radio','furniture-kit-televisionvintage','furniture-kit-plantsmall1','furniture-kit-kitchenfridge','furniture-kit-chair','blocky-characters-character-a','blocky-characters-character-e','blocky-characters-character-f','blocky-characters-character-k','blocky-characters-character-q'];
