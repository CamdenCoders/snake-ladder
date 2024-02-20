import logo from './logo.svg';
import './App.css';
import Dice from './Dice'
import Person from './Person';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import seedi from './ladder.png';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';


function Square({ val, pos }){
  return (
  <div className="square">
    <p className="squareP">{val}</p>
    <Person pos = {val} position={pos}/>
  </div>  
  );
}

function Rows({ j, flag, player }){
  let row = [];
  for(let i=0; i<10; i++)
  {
    if(flag)
    row.push(<Square val = {(i+1) + j} pos={player}/>);
    else row.push(<Square val = {(10 - i) + j} pos={player}/>);
  }
  return(
    
    <div className="rows" style={{display: "flex"}}>
     {row}
    </div>
  );
}

function Ladder({startCellPosition, endCellPosition}){
  const ladderTop = Math.min(startCellPosition.top, endCellPosition.top) + startCellPosition.height/2 + 'px';
  const ladderLeft = Math.min(startCellPosition.left, endCellPosition.left) + startCellPosition.width/2  + 'px';
  const ladderWidth = Math.abs(startCellPosition.left - endCellPosition.left )  + 'px';
  const ladderHeight = Math.abs(startCellPosition.top - endCellPosition.top )  + 'px';


  const deltaX = endCellPosition.left - startCellPosition.left;
  const deltaY = endCellPosition.top - startCellPosition.top;
  const angle =  (startCellPosition.left > endCellPosition.left) ? 90 : 0 ;

  console.log(startCellPosition);
  console.log(startCellPosition);
  // Style for the ladder
  const ladderStyle = {
    top: ladderTop,
    left: ladderLeft,
    width: ladderWidth,
    height: ladderHeight,
    position: 'absolute',
    transform: `rotate(${angle}deg)`
  };
  //       const ladderStyle = {
  //         top: startCellRect.top + 'px',
  //         left: startCellRect.left + 'px',
  //         width: endCellRect.left - startCellRect.left + 'px',
  //         height: endCellRect.top - startCellRect.top + 'px',
  //         position: 'absolute'
  //       };
      //   const svgPath = `
      //   M ${startCellRect.left + startCellRect.width / 2} ${startCellRect.top + startCellRect.height / 2}
      //   L ${endCellRect.left + endCellRect.width / 2} ${endCellRect.top + endCellRect.height / 2}
      // `;
  return (
  <div id = "seedi" >
    <img  src = {seedi} alt = "ladder" style={ladderStyle}/>

    {/* <svg className="ladder" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d={svgPath} stroke="red" strokeWidth="3" />
          </svg> */}

  </div>
  );
}

function Board({ personPos }){
  const [startCellPosition, setStartCellPosition] = useState(null);
  const [endCellPosition, setEndCellPosition] = useState(null);
  let flag = false;
  let row1 = [];

  //To create board.
  for(let i=0; i<10; i++)
  {
    row1.push(<Rows j = {(9-i)*10} flag = {flag} player={personPos}/>);
    flag = !flag;
  }
  // for(let i=0;i<10; i++)
  // {
  //   col.isnnerHTML += row;
  // }

//To Locate the ladder start and end posiitons
useEffect(() => {
const startCell = document.querySelector(".rows:nth-child(4) > .square:nth-child(10)");
const endCell = document.querySelector(".rows:nth-child(8) > .square:nth-child(5)");

if(startCell && endCell){
  const startCellRect = startCell.getBoundingClientRect();
  const endCellRect = endCell.getBoundingClientRect();
  console.log(startCellRect)
  setStartCellPosition(startCellRect);
  setEndCellPosition(endCellRect); 
}
}, []);


  return (
    <Container className="p-3">
      <div className="board">
      {row1}
      </div>
      {startCellPosition && endCellPosition && <Ladder startCellPosition={startCellPosition} endCellPosition={endCellPosition}/>}
    </Container>
  );
}

function Header(){
return(

    <div>
      <h1 style={{color: "white"}}>Snakes and Ladders</h1>
    </div>
  
);
}

function Game(){
  const [diceNum, setDiceNum] = useState(6);
  const [player, setPlayer] = useState(1);
  function roll(){
      let min = 1;
      let max = 6;
      setDiceNum(Math.floor(Math.random() * (max - min +1) ) + min);
      setPlayer(diceNum + player);
  }

  return <Row>
  <Col sm = {8}>
    <Board personPos = {player}/>
  </Col>
  <Col sm = {4}>
    <Dice number={diceNum} onDiceClick={() => roll()}/>
  </Col>
  
</Row>;
}

function App() {
  return (<>
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Header/>
      <Game/>
    </div>
  </>
  );
}

export default App;
