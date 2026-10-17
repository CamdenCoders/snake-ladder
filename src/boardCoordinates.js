// Board coordinates in a 1000 × 1000 SVG; square 1 is bottom left.
export function squarePoint(square) {
  const row = Math.floor((square - 1) / 10), column = (square - 1) % 10;
  return {x: (row % 2 ? 9-column : column)*100+50, y:950-row*100};
}
