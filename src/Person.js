import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPerson } from '@fortawesome/free-solid-svg-icons'

function Person({pos, position}){
    if(pos === position){
      console.log(position);
      return  (<FontAwesomeIcon className="personIcon" icon={faPerson}/>);
    }
    
    else
    return <></>
  } 

export default Person;