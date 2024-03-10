import Dice from './Dice'
import Board from './Board';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, createContext } from 'react';


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const playerContext = createContext();
export const ladderContext = createContext();


function Game(){
    const [diceNum, setDiceNum] = useState(6);
    const [player, setPlayer] = useState(1);
    const [reachedItemFlag, setReachedItemFlag] = useState(false);
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
        let nextPlayerPos = randDice + player;
        setDiceNum(randDice);
        setPlayer(nextPlayerPos);
        if(ladderMap.has(nextPlayerPos))
          setReachedItemFlag(true);

        // checkBonus();
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
    </Col> 
  </Row>;
  }
  
  export default Game;