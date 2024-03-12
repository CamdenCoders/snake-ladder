import Dice from './Dice'
import Board from './Board';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, createContext, useRef } from 'react';
import { gsap } from "gsap";


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from './ResetButton';

export const playerContext = createContext();
export const ladderContext = createContext();
export const refContext = createContext();


function Game(){
  const nodeRef = useRef(null);
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
        const personObj = document.getElementById("personAnim");
        console.log(nodeRef.current);
        
        //gsap.to(nodeRef.current, {color:"red", y:100, duration:2});
        //gsap.to("#personAnim", {color:"green", y:100, duration:1});
        const personEnd = personObj.getBoundingClientRect();
        

        if(nextPlayerPos > 100) nextPlayerPos = nextPlayerPos - randDice;
        setDiceNum(randDice);
        //timeout
        setPlayer(nextPlayerPos);
        if(ladderMap.has(nextPlayerPos))
          setReachedItemFlag(true);
        // checkBonus();
    }

    useEffect(()=>{
      gsap.to(nodeRef.current, {color:"green", x:100, duration:1});
    }, [player]);


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