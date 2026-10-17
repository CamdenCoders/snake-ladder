import { createContext, useEffect, useRef, useState } from 'react';
import Board from './Board';
import Dice from './dice';
import { socket } from './socket';
import diceAudio from './diceAudio.mp3';

export const playerContext = createContext([]);
export const ladderContext = createContext({ ladders: new Map(), snakes: new Map() });
export const refContext = createContext({ current: [] });
export const diceRefContext = createContext(null);
export const imageRefContext = createContext(null);
export const playerColors = ['#ffffff', '#f87171', '#4ade80', '#60a5fa', '#facc15', '#c084fc', '#fb923c', '#f472b6'];

export default function Game({ game, playerId, connected, onLeave }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [now, setNow] = useState(Date.now());
  const [share, setShare] = useState('');
  useEffect(() => {const timer=setInterval(()=>setNow(Date.now()),100); return ()=>clearInterval(timer);}, []);
  const diceRef = useRef(null);
  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const mine = game.players.findIndex(p => p.id === playerId);
  const resolving=now < (game.busyUntil || 0);
  const rolling=resolving && now < (game.lastMove?.startedAt || 0)+(game.lastMove?.diceMs || 0);
  const winner = game.players.find(p => p.id === game.winnerId);
  const canRoll = connected && game.phase === 'playing' && game.players[game.turn]?.id === playerId && !pending && now >= (game.busyUntil || 0) && !game.players.some(p=>!p.forfeited && p.connected === false);
  const moveNumber=game.lastMove?.number;
  useEffect(() => {
    if (moveNumber) audioRef.current?.play()?.catch(() => {});
  }, [moveNumber]);
  function roll() {
    if (!canRoll) return;
    setPending(true); setError('');
    socket.timeout(8000).emit('roll', { roomId: game.roomId, version: game.version }, (err, result) => {
      setPending(false);
      if (err || !result?.ok) setError(result?.error || 'Roll was not confirmed. Check your connection.');
    });
  }
  return <main className="grid grid-cols-12 text-white">
    <div className="col-span-12 lg:col-span-8 p-2"><Board game={game} /></div>
    <section className="col-span-12 lg:col-span-4 p-4">
      <h1>Snakes and Ladders</h1>
      <p>Room code: <strong>{game.roomId}</strong></p>
      <p>You are Player {mine + 1}</p>
      {!connected && <p role="alert">Disconnected. Reconnecting automatically; your slot is reserved for two minutes.</p>}
      <p role="status">{resolving ? (rolling ? 'Rolling dice…' : 'Moving player…') : winner ? `Player ${game.players.indexOf(winner) + 1} wins!` : game.players.some(p=>!p.forfeited && p.connected === false) && game.phase === 'playing' ? 'Paused — waiting for a player to reconnect' : game.phase === 'waiting' ? `Waiting for players (${game.players.length}/${game.capacity})` : `Player ${game.turn + 1}'s turn`}</p>
      <ul>{game.players.map((p, i) => <li key={p.id} style={{color: playerColors[i]}}>Player {i + 1}{p.id === playerId ? ' (you)' : ''}: square {resolving && game.lastMove?.playerId===p.id ? game.lastMove.from : p.position}{p.forfeited ? ' — forfeited' : p.connected === false ? ` — reconnecting (${Math.max(0,Math.ceil(((p.disconnectedUntil || now)-now)/1000))}s)` : ' — connected'}</li>)}</ul>
      <diceRefContext.Provider value={diceRef}><imageRefContext.Provider value={imageRef}>
        <Dice move={game.lastMove} number={game.lastMove?.roll} onDiceClick={roll} disabled={!canRoll} />
      </imageRefContext.Provider></diceRefContext.Provider>
      {!rolling && game.lastMove && <p aria-live="polite">Rolled {game.lastMove.roll}</p>}
      <div className="flex flex-wrap justify-center gap-2 my-3">
        <button className="bg-white text-black p-2 rounded" onClick={async()=>{
          try {await navigator.clipboard.writeText(game.roomId); setShare('Room code copied.');} catch {setShare(`Room code: ${game.roomId}`);}
        }}>Copy room code</button>
        <button className="bg-white text-black p-2 rounded" onClick={async()=>{
          try {
            const response=await fetch(`${process.env.PUBLIC_URL || ''}/lan-info.json`); if (!response.ok) throw Error();
            const info=await response.json();
            const url=`${info.url}/?room=${game.roomId}`;
            try {await navigator.clipboard.writeText(url); setShare(`Copied: ${url}`);} catch {setShare(url);}
          } catch {setShare(`Open http://<computer-Wi-Fi-address>:3000/?room=${game.roomId} on the same Wi-Fi.`);}
        }}>Share room link</button>
        <button className="bg-white text-black p-2 rounded" onClick={onLeave}>Leave room</button>
      </div>
      {share && <p aria-live="polite" style={{overflowWrap:'anywhere'}}>{share}</p>}
      {game.phase === 'finished' && <>
        <p>Rematch votes: {(game.rematchVotes || []).length}/{game.players.filter(p=>!p.forfeited).length}</p>
        <button className="bg-white text-black p-2 rounded" disabled={!connected || pending || (game.rematchVotes || []).includes(playerId)} onClick={()=>{
          setPending(true); socket.timeout(8000).emit('rematch',{roomId:game.roomId},(err,result)=>{
            setPending(false); if(err || !result?.ok) setError(result?.error || 'Rematch was not confirmed.');
          });
        }}>Play again</button>
      </>}
      <audio ref={audioRef} src={diceAudio} />
      <p>Land exactly on 100 to win. A six does not grant another turn.</p>
      {error && <p role="alert">{error}</p>}
    </section>
  </main>;
}
