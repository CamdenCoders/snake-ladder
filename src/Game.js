import Dice from './Dice'
import Board from './Board';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, createContext } from 'react';


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from './ResetButton';

export const playerContext = createContext();
export const ladderContext = createContext();


function Game(){
    const [diceNum, setDiceNum] = useState(6);
    const [player, setPlayer] = useState(1);
    const [reachedItemFlag, setReachedItemFlag] = useState(false);
    const ladderMap = new Map([
      [10,12],
      [11,33],
      [20,38],
      [6,24],
      [40,59],
      [45,54],
      [64,78],
      [72,91],
      [86,96]

  ]);
  
  let snlobj = {
    ladders: ladderMap
  };
  
    function roll(){
        let min = 1;
        let max = 6;
        let randDice = Math.floor(Math.random() * (max - min +1) ) + min;
        let nextPlayerPos = randDice + player;
        if(nextPlayerPos > 100) nextPlayerPos = 100;
        setDiceNum(randDice);
        setPlayer(nextPlayerPos);
        if(ladderMap.has(nextPlayerPos))
          setReachedItemFlag(true);

        // checkBonus();
    }

    function resetGame(){
        setPlayer(1);
        setDiceNum(6);
        setReachedItemFlag(false);
    }
    
    useEffect(() => {
        if(reachedItemFlag)
          setPlayer(ladderMap.get(player));
        setReachedItemFlag(false);
    }, [reachedItemFlag]);

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
      <Button onButtonClick = {() => resetGame()}></Button>
    </Col> 
  </Row>;
  }
  
  export default Game;