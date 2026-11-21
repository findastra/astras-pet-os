// Fit the revised source into the prior symbol's exact square and silhouette extent.
import {readFileSync,writeFileSync} from 'node:fs';
import {decodePng} from './sheet-to-sprites.mjs';
import {png} from './art-kit.mjs';
const dir=new URL('../art/mood-symbols/',import.meta.url);
const source=decodePng(readFileSync(new URL('sleep-source-20261120.png',dir)));
const old=decodePng(readFileSync(new URL('sleep-20261120.png',dir)));
function bounds(im){let l=im.width,t=im.height,r=0,b=0;for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++)if(im.rgba[(y*im.width+x)*4+3]>=32){l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x+1);b=Math.max(b,y+1);}return {l,t,r,b};}
const a=bounds(source),b=bounds(old),scale=Math.max(a.r-a.l,a.b-a.t)/Math.max(b.r-b.l,b.b-b.t),rgba=Buffer.alloc(old.width*old.height*4);
for(let y=0;y<old.height;y++)for(let x=0;x<old.width;x++){const sx=Math.floor((a.l+a.r)/2+(x+.5-(b.l+b.r)/2)*scale),sy=Math.floor((a.t+a.b)/2+(y+.5-(b.t+b.b)/2)*scale);if(sx<0||sx>=source.width||sy<0||sy>=source.height)continue;const from=(sy*source.width+sx)*4;if(source.rgba[from+3]<16)continue;source.rgba.copy(rgba,(y*old.width+x)*4,from,from+4);}
writeFileSync(new URL('sleep-20261120.png',dir),png(old.width,old.height,rgba));
