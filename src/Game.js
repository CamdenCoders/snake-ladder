import Dice from './Dice'
import Board from './Board';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, createContext, useRef } from 'react';
import gsap from "gsap";
import {useGSAP} from '@gsap/react';
import Button from './ResetButton';

export const playerContext = createContext();
export const ladderContext = createContext();
export const refContext = createContext();
export const diceRefContext = createContext();

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

function Header(){
  return(
  
      <div className='translate-y-1/4 mb-4'>
        <h1 className="text-white font-unbounded text-xl -mb-2 sm:text-3xl">Snakes and Ladders</h1>
        <hr className='border-2 border-white border-dotted -translate-y-full' />
      </div>
    
  );
  }

function Game(){
    const nodeRef = useRef(null);
    const [diceNum, setDiceNum] = useState(null);
    const [player, setPlayer] = useState(1);
    const [reachedItemFlag, setReachedItemFlag] = useState(false);
    const animStartObj = useRef(null);
    const diceRef = useRef(null);
  
  let snlobj = {
    ladders: ladderMap,
    snakes: snakeMap
  };

// let useflag = 0;
async function roll(){
      console.log(diceRef.current);
      var tl = gsap.timeline();
      await tl.to(diceRef.current, {rotateX:"180deg", rotateY:"180deg", transformOrigin:"60% 100%", duration:2, transition:"ease-in-out"});
      tl.to(diceRef.current, {rotateX:"-180deg", rotateY:"-180deg", transformOrigin:"60% 100%", duration:1.7, delay:1});
      let [diceRoll, nextPlayerPos] = await movePlayer(player);
      console.log(nodeRef);
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
      setTimeout(() => {  
        setDiceNum(null);
    }, 1500);
      
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
        setDiceNum(null);
        setReachedItemFlag(false);
    }
    
    useEffect(() => {
        if(reachedItemFlag && ladderMap.get(player))
          setPlayer(ladderMap.get(player));
        else if(reachedItemFlag && snakeMap.get(player))
          setPlayer(snakeMap.get(player));
      setReachedItemFlag(false);
    }, [reachedItemFlag]);

    return <div className='grid grid-cols-12'>
      <refContext.Provider value={nodeRef}>
        <ladderContext.Provider value={snlobj}>
        <playerContext.Provider value={player}>
          <div className='col-span-12 sm:col-span-8'>
            <Board />
          </div>
        </playerContext.Provider>
      </ladderContext.Provider>
      </refContext.Provider>

    <diceRefContext.Provider value={diceRef}>
    <div className='col-span-12 sm:col-span-4 justify-self-center sm:justify-self-start'>
      <Header/>
      <Dice number={diceNum} onDiceClick={() => roll()}/>
      <Button onButtonClick = {() => resetGame()}></Button>
    </div> 
    </diceRefContext.Provider>
  </div>
  }
  
  export default Game;

function getPlayerCoords(domObj){
  let scrWid = window.screen.width;
  let {top, left} = domObj.getBoundingClientRect();
  if(scrWid<=480)
  {
top = top-24;
  }
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