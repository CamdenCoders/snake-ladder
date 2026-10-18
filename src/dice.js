import './dice.css';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import one from './one.png';
import two from './two.png';
import three from './three.png';
import four from './four.png';
import five from './five.png';
import six from './six.png';
const faces=[one,six,two,five,three,four];
// Each orientation brings the corresponding fixed cube face toward the viewer.
const orientations={1:{rotateX:0,rotateY:0},2:{rotateX:0,rotateY:270},3:{rotateX:270,rotateY:0},4:{rotateX:90,rotateY:0},5:{rotateX:0,rotateY:90},6:{rotateX:0,rotateY:180}};
const forwardTarget=(start,end)=>start+((end-start+360)%360);
export default function Dice({ number, move, onDiceClick, disabled }) {
  const cube=useRef(null), moveRef=useRef(move), settled=useRef(orientations[1]);
  moveRef.current=move;
  useLayoutEffect(()=>{
    const current=moveRef.current, element=cube.current;
    const orientation=orientations[current?.roll] || orientations[1];
    const start=settled.current;
    settled.current=orientation;
    const duration=(current?.diceMs ?? 1500)/1000;
    const elapsed=current?Math.max(0,(Date.now()-current.startedAt)/1000):duration;
    if (!current || duration===0 || elapsed>=duration || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(element,{...orientation,transformOrigin:'50% 50%'}); return;
    }
    const target={rotateX:forwardTarget(start.rotateX,orientation.rotateX),rotateY:forwardTarget(start.rotateY,orientation.rotateY)};
    if(target.rotateX===start.rotateX && target.rotateY===start.rotateY) target.rotateX+=360;
    const timeline=gsap.timeline();
    timeline.fromTo(element,{...start,transformOrigin:'50% 50%'},{
      ...target,
      duration,ease:'power2.out'
    });
    timeline.seek(elapsed);
    return ()=>timeline.kill();
  },[move?.number]);
  return <button type="button" onClick={onDiceClick} disabled={disabled} aria-label="Roll dice" className="dice-button">
    <span className="dice-scene"><span ref={cube} className="dice-cube">
      {faces.map((src,i)=><span key={i} className={`dice-face dice-face-${i}`}><img src={src} alt="" aria-hidden="true" /></span>)}
    </span></span>
    <span className="dice-label">Roll dice</span>
  </button>;
}
