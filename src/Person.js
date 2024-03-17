import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPerson } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import {refContext} from './Game';

const colors = ["text-white", "text-red-500", "text-green-500"]

function Person({pos, position}){
  const ref = useContext(refContext);
      return  (
      <>
        {position.map((p, index) => {
        if (pos === p) {
          return <FontAwesomeIcon className={`-translate-y-6 sm:translate-y-0 sm:mb-0 text-sm sm:text-3xl ${colors[index]}`} key={index} icon={faPerson} ref={(element) => ref.current[index] = element}/>;
        } else {
          return null;
        }
      })}
      </>
      
      );
  } 

export default Person;