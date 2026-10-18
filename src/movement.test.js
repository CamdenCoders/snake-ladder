import { squarePoint, movementFrames } from './movement';
test('coordinates follow serpentine rows',()=>{
 expect(squarePoint(1)).toEqual({x:50,y:950}); expect(squarePoint(10)).toEqual({x:950,y:950});
 expect(squarePoint(11)).toEqual({x:950,y:850});expect(squarePoint(100)).toEqual({x:50,y:50});
});
test('move visits each square then interpolates ladder to its destination',()=>{
 const frames=movementFrames({from:1,landed:6,to:24});
 expect(frames.slice(0,6).map(f=>f.square)).toEqual([1,2,3,4,5,6]);
 expect(frames.at(-1).point).toEqual(squarePoint(24));expect(frames.at(-1).at).toBe(1500);
});
test('snake follows a curve and overshoot remains at starting square',()=>{
 const frames=movementFrames({from:18,landed:19,to:4});
 expect(frames.at(-1).point).toEqual(squarePoint(4));expect(frames).toHaveLength(22);
 expect(movementFrames({from:99,landed:99,to:99})).toHaveLength(1);
});

test('tokens hold at their starting square while dice roll',()=>{
 const frames=movementFrames({from:1,landed:3,to:3,diceMs:1500});
 expect(frames.map(f=>[f.square,f.at])).toEqual([[1,0],[1,1500],[2,1660],[3,1820]]);
});
