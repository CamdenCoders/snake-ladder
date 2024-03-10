import seedi from './ladder.png';

function Ladder({startCellPosition, endCellPosition}){
    const ladderTop = Math.min(startCellPosition.top, endCellPosition.top) + startCellPosition.width/3  + 'px';
    const ladderLeft = Math.min(startCellPosition.left, endCellPosition.left) + startCellPosition.width/2  + 'px';
    const ladderWidth = Math.abs(startCellPosition.left - endCellPosition.left ) + 'px';
    const ladderHeight = Math.abs(startCellPosition.top - endCellPosition.top ) + startCellPosition.height/2  + 'px';
  
  
    // const deltaX = endCellPosition.left - startCellPosition.left;
    // const deltaY = endCellPosition.top - startCellPosition.top;
    const angle =  (startCellPosition.left > endCellPosition.left) ? -1 : 1 ;
  
    console.log("Ladder");
    // Style for the ladder
    const ladderStyle = {
      top: ladderTop,
      left: ladderLeft,
      width: ladderWidth,
      height: ladderHeight,
      position: 'absolute',
      transform: `scaleX(${angle})`
    };
  
    return (
    <div id = "seedi" >
      <img  src = {seedi} alt = "ladder" style={ladderStyle}/>
    </div>
    );
  }


  export default Ladder;