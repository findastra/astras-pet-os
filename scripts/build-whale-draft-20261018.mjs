// Reuse the existing corrected sheet. OpenAI Codex (GPT-6), 2026-10-18.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {sheetToSprite,decodePng} from './sheet-to-sprites.mjs';
import {addIndicators} from './indicators.mjs';
import {png} from './art-kit.mjs';
const dir='art/drafts/workflow-whale';
// The generated sheet is not an exact equal-cell grid: tails cross nominal thirds.
// Split by connected alpha regions before fitting, preserving the whole silhouette.
const img=decodePng(readFileSync(`${dir}/workflow-whale-mood-sheet-20261016.png`));
const seen=new Uint8Array(img.width*img.height), regions=[];
for(let n=0;n<seen.length;n++){
 if(seen[n]||img.rgba[n*4+3]<128)continue;
 const queue=[n];seen[n]=1;let x0=img.width,y0=img.height,x1=0,y1=0;
 for(let k=0;k<queue.length;k++){const i=queue[k],x=i%img.width,y=Math.floor(i/img.width);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);
 for(const [nx,ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){if(nx<0||ny<0||nx>=img.width||ny>=img.height)continue;const j=ny*img.width+nx;if(!seen[j]&&img.rgba[j*4+3]>=128){seen[j]=1;queue.push(j);}}}
 if(queue.length>1000)regions.push({x0,y0,x1,y1,pixels:queue.length});
}
regions.sort((a,b)=>b.pixels-a.pixels);const tiles=regions.slice(0,9);if(tiles.length!==9)throw Error('Expected nine whale silhouettes');
tiles.sort((a,b)=>Math.round(a.y0/300)-Math.round(b.y0/300)||a.x0-b.x0);
const normalized=Buffer.alloc(768*768*4);
tiles.forEach((b,k)=>{const w=b.x1-b.x0+1,h=b.y1-b.y0+1,s=210/Math.max(w,h),dw=Math.round(w*s),dh=Math.round(h*s),ox=(k%3)*256+Math.floor((256-dw)/2),oy=Math.floor(k/3)*256+Math.floor((256-dh)/2);
 for(let y=0;y<dh;y++)for(let x=0;x<dw;x++){const si=((b.y0+Math.min(h-1,Math.floor(y/s)))*img.width+b.x0+Math.min(w-1,Math.floor(x/s)))*4;img.rgba.copy(normalized,((oy+y)*768+ox+x)*4,si,si+4);}});
const sprite=addIndicators(sheetToSprite(png(768,768,normalized),{size:256,colours:24}));
for(const [mood,f] of Object.entries(sprite.frames)){
 const rgba=Buffer.alloc(256*256*4);
 f.rows.forEach((r,y)=>[...r].forEach((c,x)=>{const h=f.pal[c];if(!h)return; const i=(y*256+x)*4;for(let k=0;k<3;k++)rgba[i+k]=parseInt(h.slice(1+2*k,3+2*k),16);rgba[i+3]=255;}));
 const bytes=png(256,256,rgba); writeFileSync(`${dir}/${mood}-20261018.png`,bytes);
 if(mood==='idle'){mkdirSync('art/icons',{recursive:true});writeFileSync('art/icons/workflow-whirlpool-20261018.png',bytes);}
}
console.log('Nine draft mood frames and the program icon built from existing art.');
