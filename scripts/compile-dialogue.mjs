import fs from 'node:fs';
import { Compiler } from 'inkjs/full';
const source=fs.readFileSync('src/dialogue/townspeople.ink','utf8');
const compiler=new Compiler(source);
try{
  const story=compiler.Compile();
  if(compiler.errors.length)throw new Error(compiler.errors.join('\n'));
  fs.writeFileSync('src/dialogue/townspeople.json',story.ToJson());
  console.log('Ink compilado: townspeople.json');
}catch{console.error(compiler.errors.join('\n'));process.exitCode=1;}
