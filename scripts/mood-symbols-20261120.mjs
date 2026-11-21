// Shared approved full-color symbols. By Astra; implementation Codex, 2026-11-20.
import {readFileSync} from 'node:fs';
import {decodePng,MOODS} from './sheet-to-sprites.mjs';
const symbols=new Map();
export function stampMoodSymbol(rgba,width,height,mood){
  const out=Buffer.from(rgba);
  if(!MOODS.includes(mood))return out;
  if(!symbols.has(mood))symbols.set(mood,decodePng(readFileSync(new URL(`../art/mood-symbols/${mood}-20261120.png`,import.meta.url))));
  const src=symbols.get(mood),size=Math.max(1,Math.round(Math.min(width,height)*.23));
  const inset=Math.max(1,Math.round(Math.min(width,height)/64)),ox=width-size-inset,oy=inset;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const si=(Math.floor(y*src.height/size)*src.width+Math.floor(x*src.width/size))*4;
    const a=src.rgba[si+3]/255;if(!a)continue;
    const di=((oy+y)*width+ox+x)*4,da=out[di+3]/255,alpha=a+da*(1-a);
    for(let c=0;c<3;c++)out[di+c]=Math.round((src.rgba[si+c]*a+out[di+c]*da*(1-a))/alpha);
    out[di+3]=Math.round(alpha*255);
  }
  return out;
}
