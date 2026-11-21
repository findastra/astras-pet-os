import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {decodePng,MOODS} from '../scripts/sheet-to-sprites.mjs';
import {stampMoodSymbol} from '../scripts/mood-symbols-20261120.mjs';
test('shared symbols preserve input and stay inside the same square',()=>{
  for(const mood of MOODS){const src=Buffer.alloc(256*256*4),out=stampMoodSymbol(src,256,256,mood);assert.equal(src.some(x=>x!==0),false);assert.equal(out.length,src.length);let opaque=0;for(let y=0;y<256;y++)for(let x=0;x<256;x++){const a=out[(y*256+x)*4+3];if(a){opaque++;assert.ok(x>=193&&x<252&&y>=4&&y<63);}}assert.ok(opaque>20);}
});
test('sleep is purple and happy is neon pink with a dark outline',()=>{
  for(const mood of ['sleep','happy']){const im=decodePng(readFileSync(new URL(`../art/mood-symbols/${mood}-20261120.png`,import.meta.url)));let color=0,ink=0;for(let i=0;i<im.rgba.length;i+=4){const [r,g,b,a]=im.rgba.subarray(i,i+4);if(a<200)continue;if(r<35&&g<35&&b<35)ink++;if(mood==='sleep'?r>110&&b>180&&g<150:r>200&&g<70&&b>100)color++;}assert.ok(color>100);assert.ok(ink>100);}
});
