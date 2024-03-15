import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPerson } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import {refContext} from './Game';


function Person({pos, position}){
  // gsap.to("#personAnim", {color:"green", y:100, duration:1});
  const ref = useContext(refContext);
    if(pos === position){
      return  (
      <>
      {/* <FontAwesomeIcon className="personIcon" icon={faPerson}/> */}
      <FontAwesomeIcon ref={ref} id="personAnim" className="-translate-y-6 sm:translate-y-0 sm:mb-0 text-sm sm:text-3xl" icon={faPerson}/>
      </>
      
      );
    }
    
    else
    return <></>
  } 

export default Person;