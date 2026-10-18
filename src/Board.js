import { useLayoutEffect, useRef, useState } from 'react';
import snakeImage from './Snake.png';
import ladderImage from './ladder.png';
import { faPerson } from '@fortawesome/free-solid-svg-icons';
import { artworkTransform } from './artwork';
import { playerColors } from './Game';
import { squarePoint, movementFrames } from './movement';
export default function Board({game}) {
  const [motion,setMotion] = useState(null);
  const moveRef=useRef(game.lastMove);
  moveRef.current=game.lastMove;
  useLayoutEffect(()=>{
    const move=moveRef.current;
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!move || reduced || Date.now() >= (move.startedAt || 0) + (move.duration || 0)) {setMotion(null); return;}
    const elapsed=Date.now()-move.startedAt, frames=movementFrames(move), timers=[];
    let previous=frames[0];
    for(const frame of frames) {if(frame.at<=elapsed) previous=frame;}
    setMotion({id:move.playerId,point:previous.point,duration:0});
    for(let i=1;i<frames.length;i++) {
      const target=frames[i], start=frames[i-1].at;
      if(target.at<=elapsed) continue;
      timers.push(setTimeout(()=>setMotion({id:move.playerId,point:target.point,duration:target.at-Math.max(start,elapsed)}),Math.max(20,start-elapsed+20)));
    }
    timers.push(setTimeout(()=>setMotion(null),Math.max(0,move.startedAt+move.duration-Date.now())));
    return ()=>timers.forEach(clearTimeout);
  },[game.lastMove?.number]); // Metadata snapshots must not restart a move.
  return <svg viewBox="0 0 1000 1000" role="img" aria-label="Snakes and Ladders board" style={{width:'100%',maxWidth:800,display:'block',margin:'auto',background:'black'}}>
    {Array.from({length:100},(_,i)=>{
      const p=squarePoint(i+1); return <g key={i}><rect x={p.x-50} y={p.y-50} width="100" height="100" fill="black" stroke="#ef4444" />
        <text x={p.x-42} y={p.y-24} fill="white" fontSize="19">{i+1}</text></g>;
    })}
    {[...game.ladders.map(pair=>({pair,snake:false})),...game.snakes.map(pair=>({pair,snake:true}))].map(({pair:[from,to],snake})=>{
      const m=artworkTransform(from,to,snake);
      return <image key={`${snake?'snake':'ladder'}-${from}`} href={snake?snakeImage:ladderImage}
        x="0" y="0" width="1" height="1" preserveAspectRatio="none"
        transform={`matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})`}
        role="img" aria-label={`${snake?'Snake':'Ladder'} from ${from} to ${to}`} />;
    })}
    {game.players.map((player,index)=>{
      if(player.forfeited) return null;
      const p=motion?.id===player.id?motion.point:squarePoint(player.position);
      const dx=(index%4-1.5)*20,dy=Math.floor(index/4)*23;
      return <g key={player.id} role="img" aria-label={`Player ${index+1}, square ${player.position}`} style={{transform:`translate(${p.x+dx}px, ${p.y+dy}px)`,transition:motion?.id===player.id?`transform ${motion.duration}ms linear`:'none'}}>
        <title>Player {index+1}, square {player.position}</title>
        <svg x="-10" y="-18" width="20" height="36" viewBox={`0 0 ${faPerson.icon[0]} ${faPerson.icon[1]}`} aria-hidden="true">
          <path fill={playerColors[index]} d={faPerson.icon[4]} />
        </svg>
      </g>;
    })}
  </svg>;
}
