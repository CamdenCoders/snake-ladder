import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { refContext, playerColors } from './Game';
export default function Person({ pos, position }) {
  const ref = useContext(refContext);
  return <span style={{display:'flex', flexWrap:'wrap', position:'relative', zIndex:2}}>
    {position.map((p, index) => p === pos ? <FontAwesomeIcon key={index} icon={faPerson}
      title={`Player ${index+1}`} style={{color:playerColors[index], width:'0.65em'}}
      ref={element => { ref.current[index] = element; }} /> : null)}
  </span>;
}
