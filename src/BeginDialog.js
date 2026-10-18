import { useEffect, useRef, useState } from 'react';
import { socket } from './socket';
import Game from './Game';
function localTime(state) {
  const offset = state.serverTime ? Date.now()-state.serverTime : 0;
  return {...state, busyUntil:(state.busyUntil || 0)+offset, lastMove:state.lastMove ? {...state.lastMove, startedAt:state.lastMove.startedAt+offset} : null, players:state.players.map(p=>({...p, disconnectedUntil:p.disconnectedUntil ? p.disconnectedUntil+offset : undefined}))};
}
const KEY = 'snake-ladder-session';
function savedSession() { try {return JSON.parse(sessionStorage.getItem(KEY));} catch {return null;} }
export default function BeginDialog() {
  const [game, setGame] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [room, setRoom] = useState(new URLSearchParams(window.location.search).get('room') || '');
  const [capacity, setCapacity] = useState(4);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [connected, setConnected] = useState(socket.connected);
  const latest = useRef(null), session = useRef(savedSession());
  function clear() {
    session.current = null; sessionStorage.removeItem(KEY); latest.current = null;
    setGame(null); setPlayerId(null); setPending(false);
  }
  function accept(result) {
    result = {...result, state:localTime(result.state)};
    session.current = { roomId: result.state.roomId, token: result.token };
    sessionStorage.setItem(KEY, JSON.stringify(session.current));
    setPlayerId(result.playerId); setConnected(true);
    if (!latest.current || result.state.roomId !== latest.current.roomId || result.state.version >= latest.current.version) {latest.current = result.state; setGame(result.state);}
  }
  useEffect(() => {
    const state = incoming => {
      const value=localTime(incoming);
      if (latest.current && (value.roomId !== latest.current.roomId || value.version <= latest.current.version)) return;
      latest.current = value; setGame(value);
    };
    const connect = () => {
      if (!session.current) {setConnected(true); return;}
      setPending(true);
      socket.timeout(8000).emit('resume-room', session.current, (err, result) => {
        setPending(false);
        if (err) {setError('Recovery timed out. Use Reconnect to try again.'); return;}
        if (!result?.ok) {clear(); setError(result?.error || 'Could not restore the game.'); return;}
        accept(result); setError('');
      });
    };
    const disconnect = () => setConnected(false);
    const failed = () => {setError('Cannot connect to the game server. Check Wi-Fi and server startup.'); setPending(false);};
    socket.on('game-state', state); socket.on('connect', connect); socket.on('disconnect', disconnect); socket.on('connect_error', failed);
    if (session.current) {setConnected(false); if (socket.connected) connect(); else socket.connect();}
    return () => {socket.off('game-state', state); socket.off('connect', connect); socket.off('disconnect', disconnect); socket.off('connect_error', failed);};
  }, []);
  function enter(event) {
    if (pending) return;
    setPending(true); setError(''); socket.connect();
    socket.timeout(8000).emit(event, {roomId:room.trim().toUpperCase(), capacity:Number(capacity)}, (err, result) => {
      setPending(false);
      if (err || !result?.ok) {setError(result?.error || 'Request timed out. Please try again.'); return;}
      accept(result);
    });
  }
  function leave() {
    if (!socket.connected) {setError('Reconnect before leaving, or wait two minutes for your slot to expire.'); return;}
    socket.timeout(8000).emit('leave-room', {roomId:game.roomId}, (err, result) => {
      if (err || !result?.ok) {setError(result?.error || 'Leave was not confirmed. Try again.'); return;}
      clear(); setError('');
    });
  }
  if (game && playerId) return <><Game game={game} playerId={playerId} connected={connected} onLeave={leave} />
    {error && <p className="text-white" role="alert">{error}</p>}
    {!connected && <button className="bg-white p-2" onClick={() => {socket.disconnect(); socket.connect();}}>Reconnect</button>}
  </>;
  return <main className="text-white p-4 mx-auto" style={{maxWidth:480}}>
    <h1>Snakes and Ladders</h1><p>Create a room for 2–8 players or join a friend.</p>
    <label htmlFor="capacity">Number of players</label>
    <select id="capacity" className="text-black m-2 p-2" value={capacity} onChange={e=>setCapacity(e.target.value)}>{[2,3,4,5,6,7,8].map(n=><option key={n}>{n}</option>)}</select>
    <button className="bg-white text-black p-2 m-2 rounded" disabled={pending} onClick={()=>enter('create-room')}>New Game</button><hr />
    <label htmlFor="room">Room code</label><input id="room" className="text-black p-2 m-2" value={room} maxLength={6} onChange={e=>setRoom(e.target.value)} />
    <button className="bg-white text-black p-2 m-2 rounded" disabled={pending || !room.trim()} onClick={()=>enter('join-room')}>Join Game</button>
    {pending && <p role="status">Connecting…</p>}{error && <p role="alert">{error}</p>}
  </main>;
}
