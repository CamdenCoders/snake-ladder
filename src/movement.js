import { artworkTransform, artworkPoint, snakeSpine } from './artwork';
import { squarePoint } from './boardCoordinates';
export { squarePoint } from './boardCoordinates';
export function movementFrames(move) {
  if (!move) return [];
  const frames = [{square:move.from, point:squarePoint(move.from), at:0}];
  const delay=move.diceMs || 0;
  if (delay) frames.push({...frames[0],at:delay});
  for (let square=move.from+1; square<=move.landed; square++) frames.push({square,point:squarePoint(square),at:delay+(square-move.from)*160});
  if (move.to !== move.landed) {
    const a=squarePoint(move.landed), b=squarePoint(move.to);
    for(let i=1;i<=20;i++) {
      const t=i/20;
      let point;
      if (move.to < move.landed) {
        const n=t*(snakeSpine.length-1), j=Math.min(Math.floor(n),snakeSpine.length-2), f=n-j;
        const [x,y]=snakeSpine[j], [xx,yy]=snakeSpine[j+1];
        point=artworkPoint(artworkTransform(move.landed,move.to,true),x+(xx-x)*f,y+(yy-y)*f);
      } else point={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
      frames.push({square:move.to,point,at:delay+(move.landed-move.from)*160+i*35});
    }
  }
  return frames;
}
