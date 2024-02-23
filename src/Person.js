import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPerson } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react';
import {ladderContext} from './App'


function Person({pos, position}){
    const ladderMap = useContext(ladderContext).ladders;
    if(ladderMap.has(position))
      position = ladderMap.get(position);
    if(pos === position){
      return  (<FontAwesomeIcon className="personIcon" icon={faPerson}/>);
    }
    
    else
    return <></>
  } 

export default Person;