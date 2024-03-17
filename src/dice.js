import './dice.css';
import gsap from "gsap";
import { useContext, useRef } from 'react';
import { diceRefContext } from './Game';
import one from './one.png';
import two from './two.png';
import three from './three.png';
import four from './four.png';
import five from './five.png';
import six from './six.png';
import red from './red.png';
export default function Dice({onDiceClick, number}){
    const diceRef = useContext(diceRefContext);
    let image;
    console.log(number);
    switch(number)
    {
case 1: image = one; break;
case 2: image = two; break;
case 3: image = three; break;
case 4: image = four; break;
case 5: image = five; break;
case 6: image = six; break;
default: image = red;
    }
    // function diceMove(){
    //     var tl = gsap.timeline();
    //     tl.to(diceRef.current, {rotateX:"180deg", rotateY:"180deg", transformOrigin:"60% 100%", duration:2, transition:"ease-in-out"});
    //     tl.to(diceRef.current, {rotateX:"-180deg", rotateY:"-180deg", transformOrigin:"60% 100%", duration:1.7, delay:1});
    // }
    return (
        
        // <div id="diceRoll" className=" text-black cursor-pointer grid translate-x-3/4 sm:translate-x-28 sm:absolute sm:top-1/3 sm:right-1/4 justify-center place-content-center w-16 h-16 border-1 border-red-500 p-5 rounded-lg" onClick={onDiceClick}>
        //         <p className='font-unbounded text-center text-white text-4xl mt-3 font-bold'>
        //         {number}
        //         </p>   

                
        // </div>
        <>
        
        <div ref = {diceRef} onClick={onDiceClick} className="cube">
            <div className="cubeFace"></div>
            <div className="cubeFace face2"></div>
        </div> 
        {
            number && (
                <img src={image} onClick={onDiceClick} className='border-red-500 absolute w-[70px] h-[70px] top-28 right-60 -mr-5' />
            )
        }
        {/* <p className='font-unbounded mt-3 font-bold text-3xl text-white absolute top-28 right-60 mr-1'>{number}</p> */}
        </>
    );
}

