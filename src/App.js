import logo from './logo.svg';
import './App.css';
import Dice from './Dice'
import Person from './Person';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
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

function Ladder(){
  const startCell = document.querySelector(".rows:nth-child(2) > .square:nth-child(4)");
  const endCell = document.querySelector(".rows:nth-child(8) > .square:nth-child(1)");
  const startCellRect = startCell?.getBoundingClientRect();
  const endCellRect = endCell?.getBoundingClientRect();

        const ladderStyle = {
          top: startCellRect.top + 'px',
          left: startCellRect.left + 'px',
          width: endCellRect.left - startCellRect.left + 'px',
          height: endCellRect.top - startCellRect.top + 'px',
          position: 'absolute'
        };
        const svgPath = `
        M ${startCellRect.left + startCellRect.width / 2} ${startCellRect.top + startCellRect.height / 2}
        L ${endCellRect.left + endCellRect.width / 2} ${endCellRect.top + endCellRect.height / 2}
      `;
  return (
  <div id = "seedi">
    <img  src = {seedi} style={ladderStyle} width={200} height={200} alt = "ladder"/>

    <svg className="ladder" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d={svgPath} stroke="red" strokeWidth="3" />
          </svg>

  </div>
  );
}

function Board({ personPos }){
  let flag = false;
  let row1 = [];
  for(let i=0; i<10; i++)
  {
    row1.push(<Rows j = {(9-i)*10} flag = {flag} player={personPos}/>);
    flag = !flag;
  }
  // for(let i=0;i<10; i++)
  // {
  //   col.isnnerHTML += row;
  // }

  return (
    <Container className="p-3">
      <div className="board">
      {row1}
      </div>
      <Ladder/>
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
