import Dice from './Dice'
import Board from './Board';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, createContext, useRef } from 'react';
import gsap from "gsap";
import {useGSAP} from '@gsap/react';


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from './ResetButton';

export const playerContext = createContext();
export const ladderContext = createContext();
export const refContext = createContext();

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
const snakeMap = new Map([
  [19, 4],
  [13, 7],
  [48, 14],
  [57, 36],
  [68, 49],
  [83, 61],
  [87, 66],
  [94, 88],
  [98, 84]
]);

function Game(){
    const nodeRef = useRef(null);
    const [diceNum, setDiceNum] = useState(6);
    const [player, setPlayer] = useState(1);
    const [reachedItemFlag, setReachedItemFlag] = useState(false);
    const animStartObj = useRef(null);
  
  let snlobj = {
    ladders: ladderMap,
    snakes: snakeMap
  };

// let useflag = 0;
async function roll(){
      let [diceRoll, nextPlayerPos] = await movePlayer(player);
      
      animStartObj.current = await getPlayerCoords(nodeRef.current);

      setDiceNum(diceRoll);
      setPlayer(nextPlayerPos);
  
      setTimeout(() => {
        if(ladderMap.has(nextPlayerPos) || snakeMap.has(nextPlayerPos)){
          animStartObj.current = getPlayerCoords(nodeRef.current);
          setTimeout(() => {  
              setReachedItemFlag(true);
          }, 500);
        }
      }, 500);
      

      // checkBonus();
    }

    useGSAP(()=>{
      if(animStartObj.current)  {
        console.log(animStartObj.current);
        const {top, left} = nodeRef.current.getBoundingClientRect();
        gsap.from(nodeRef.current, {x: animStartObj.current.left-left, y: animStartObj.current.top-top, 
        duration: 0.5});
      } 
    },{ dependencies: [player], revertOnUpdate: false});


    function resetGame(){
        setPlayer(1);
        setDiceNum(6);
        setReachedItemFlag(false);
    }
    
    useEffect(() => {
        if(reachedItemFlag && ladderMap.get(player))
          setPlayer(ladderMap.get(player));
        else if(reachedItemFlag && snakeMap.get(player))
          setPlayer(snakeMap.get(player));
      setReachedItemFlag(false);
    }, [reachedItemFlag]);

    return <Row>
      <refContext.Provider value={nodeRef}>
        <ladderContext.Provider value={snlobj}>
        <playerContext.Provider value={player}>
          <Col sm = {8}>
            <Board />
          </Col>
        </playerContext.Provider>
      </ladderContext.Provider>
      </refContext.Provider>
    
    <Col sm = {4}>
      <Dice number={diceNum} onDiceClick={() => roll()}/>
      <Button onButtonClick = {() => resetGame()}></Button>
    </Col> 
  </Row>;
  }
  
  export default Game;

function getPlayerCoords(domObj){
  const {top, left} = domObj.getBoundingClientRect();
  return {top, left};
}

function movePlayer(player){
  let min = 1;
  let max = 6;
  let randDice = Math.floor(Math.random() * (max - min +1) ) + min;
  let nextPlayerPos = randDice + player;

  if(nextPlayerPos > 100) nextPlayerPos = nextPlayerPos - randDice;

  return [randDice, nextPlayerPos];
}