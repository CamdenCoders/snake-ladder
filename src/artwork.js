import { squarePoint } from './boardCoordinates';
// Map landmarks in the original artwork to board square centers.
export function artworkTransform(from, to, snake = false) {
  const p=squarePoint(from),q=squarePoint(to);
  if (snake) {
    const a=120, c=(q.x-p.x-a*0.71)/0.97, d=(q.y-p.y)/0.97;
    return {a,b:0,c,d,e:p.x-a*0.28-c*0.03,f:p.y-d*0.03};
  }
  const a=Math.abs(q.x-p.x)<30?80:(q.x-p.x)/0.88;
  const c=(q.x-p.x)/0.88-a,d=(q.y-p.y)/0.88;
  return {a,b:0,c,d,e:p.x-(a+c)*0.06,f:p.y-d*0.06};
}
export function artworkPoint(matrix, x, y) {
  return {x:matrix.a*x+matrix.c*y+matrix.e,y:matrix.b*x+matrix.d*y+matrix.f};
}
export const snakeSpine = [[0.28,0.03],[0.45,0.07],[0.50,0.12],[0.40,0.16],[0.08,0.20],[0.12,0.26],[0.60,0.32],[0.85,0.40],[0.75,0.46],[0.40,0.50],[0.08,0.57],[0.05,0.65],[0.35,0.69],[0.61,0.75],[0.58,0.82],[0.57,0.88],[0.70,0.94],[0.99,1]];
