import * as T from 'three';
const loader = new T.TextureLoader();
export function surface(material:T.MeshStandardMaterial, name:string, repeat=1) {
  const texture=loader.load(`assets/vendor/textures/${name}.jpg`);
  texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;
  texture.repeat.set(repeat,repeat);texture.magFilter=T.NearestFilter;texture.minFilter=T.LinearMipmapLinearFilter;
  if(name==='wood')material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#ifdef USE_MAP
      vec4 grainSample=texture2D(map,vMapUv);
      float grain=dot(grainSample.rgb,vec3(.3,.59,.11));
      diffuseColor.rgb*=.72+min(1.,grain*4.)*.65;
      #endif`);};
  material.map=texture;material.needsUpdate=true;return material;
}
