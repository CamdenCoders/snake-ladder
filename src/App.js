import './App.css';
import Dice from './Dice'
import Person from './Person';
import Ladder from './Ladder';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, createContext, useContext } from 'react';


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const playerContext = createContext();
export const ladderContext = createContext();

function Square({ val }){
  const playerPos = useContext(playerContext);
  return (
  <div id = {val} className="square">
      <p className="squareP">{val}</p>
    <Person pos = {val} position={playerPos}/>
  </div>  
  );
}

function Rows({ j, flag }){
  let row = [];
  for(let i=0; i<10; i++)
  {
    if(flag)
      row.push(<Square val = {(i+1) + j} />);
    else row.push(<Square val = {(10 - i) + j} />);
  }
  return(
    
    <div className="rows" style={{display: "flex"}}>
     {row}
    </div>
  );
}

function Board(){
  const ladderCoords = useContext(ladderContext).ladders;
  const [ladderPositions, setLadderPositions] = useState(null);
  let flag = false;
  let row1 = [];
  let ladders = [];

  //To create board.
  for(let i=0; i<10; i++){
    row1.push(<Rows j = {(9-i)*10} flag = {flag} />);
    flag = !flag;
  }
//To Locate the ladder start and end posiitons
useEffect(() => {
    ladderCoords.forEach((start, end) => {
      const startCell = document.getElementById(start);
      const endCell = document.getElementById(end);
      if(startCell && endCell){
        const startCellRect = startCell.getBoundingClientRect();
        const endCellRect = endCell.getBoundingClientRect();
        ladders.push(<Ladder startCellPosition={startCellRect} endCellPosition={endCellRect}/>);
      }});
      console.log(ladders)
}, []);
console.log(ladders);
  return (
      <Container className="p-3">
        <div className="board">
          {row1}
        </div>
        {ladders[0]}
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
  const ladderMap = new Map([
    [3,43],
    [7,52],
    [12,34],
    [45,82],
    [67,99],
    [80,91]
]);

let snlobj = {
  ladders: ladderMap
};

  function roll(){
      let min = 1;
      let max = 6;
      let randDice = Math.floor(Math.random() * (max - min +1) ) + min;
      setDiceNum(randDice);
      setPlayer(randDice + player);
  }

  return <Row>
  <ladderContext.Provider value={snlobj}>
    <playerContext.Provider value={player}>
      <Col sm = {8}>
        <Board/>
      </Col>
    </playerContext.Provider>
  </ladderContext.Provider>
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