import seedi from './ladder.png';
import saanp from './Snake.png';

function Ladder({startCellPosition, endCellPosition, itemType}){
    const ladderTop = Math.min(startCellPosition.top, endCellPosition.top) + startCellPosition.width/3  + 'px';
    const ladderLeft = Math.min(startCellPosition.left, endCellPosition.left) + startCellPosition.width/2  + 'px';
    const ladderWidth = Math.abs(startCellPosition.left - endCellPosition.left ) + 'px';
    const ladderHeight = Math.abs(startCellPosition.top - endCellPosition.top ) + startCellPosition.height/2  + 'px';
  
  
    // const deltaX = endCellPosition.left - startCellPosition.left;
    // const deltaY = endCellPosition.top - startCellPosition.top;
    const angle =  (startCellPosition.left > endCellPosition.left) ? -1 : 1 ;
      // Style for the ladder
    const ladderStyle = {
      top: ladderTop,
      left: ladderLeft,
      width: ladderWidth,
      height: ladderHeight,
      position: 'absolute',
      transform: `scaleX(${angle})`
    };
  
    if(itemType === "Ladder")
      return (
      <div id = "seedi" >
        <img  src = {seedi} alt = "ladder" style={ladderStyle}/>
      </div>
      );
    
    return (
      <div id = "saanp" >
        <img  src = {saanp} alt = "snake" style={ladderStyle}/>
      </div>
      );
  }


  export default Ladder;