import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';
import Game from './Game';
import { socket } from './socket';
jest.mock('./socket', () => ({ socket: { connected: true, on: jest.fn(), off: jest.fn(), connect: jest.fn(), timeout: jest.fn(), emit: jest.fn() } }));
jest.mock('./Board', () => () => <div>Board</div>);
beforeEach(() => { sessionStorage.clear(); localStorage.clear(); jest.clearAllMocks(); socket.timeout.mockReturnValue(socket); });
const game = {roomId:'ABCDEF', capacity:3, version:3, phase:'playing', turn:0, players:[{id:'a',position:1},{id:'b',position:1},{id:'c',position:1}], ladders:[], snakes:[], lastMove:null};
test('room creation passes selected capacity and waits for acceptance', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Number of players'), {target:{value:'3'}});
  fireEvent.click(screen.getByText('New Game'));
  expect(socket.emit).toHaveBeenCalledWith('create-room', expect.objectContaining({capacity:3}), expect.any(Function));
  expect(screen.getByText('Connecting…')).toBeInTheDocument();
  act(() => socket.emit.mock.calls[0][2](null,{ok:false,error:'Room full'}));
  expect(screen.getByRole('alert')).toHaveTextContent('Room full');
  expect(screen.getByText('New Game')).toBeInTheDocument();
});
test('accepted admission displays player identity and server snapshots, ignoring stale ones', () => {
  render(<App />); fireEvent.click(screen.getByText('New Game'));
  act(() => socket.emit.mock.calls[0][2](null,{ok:true,playerId:'c',state:game}));
  expect(screen.getByText('You are Player 3')).toBeInTheDocument();
  const update=socket.on.mock.calls.find(([event])=>event==='game-state')[1];
  act(()=> update({...game,version:4,turn:2}));
  expect(screen.getByRole('status')).toHaveTextContent("Player 3's turn");
  act(()=> update({...game,version:3,turn:0}));
  expect(screen.getByRole('status')).toHaveTextContent("Player 3's turn");
});
test('roll is a single versioned request and locks while awaiting server', () => {
  render(<Game game={game} playerId="a" connected />);
  fireEvent.click(screen.getByRole('button',{name:'Roll dice'}));
  fireEvent.click(screen.getByRole('button',{name:'Roll dice'}));
  expect(socket.emit).toHaveBeenCalledTimes(1);
  expect(socket.emit).toHaveBeenCalledWith('roll',{roomId:'ABCDEF',version:3},expect.any(Function));
});
test('waiting, opponents turn and finished game disable rolling', () => {
  const {rerender}=render(<Game game={game} playerId="b" connected />);
  expect(screen.getByRole('button',{name:'Roll dice'})).toBeDisabled();
  rerender(<Game game={{...game,phase:'waiting'}} playerId="a" connected />);
  expect(screen.getByRole('button',{name:'Roll dice'})).toBeDisabled();
  rerender(<Game game={{...game,phase:'finished',winnerId:'c'}} playerId="a" connected />);
  expect(screen.getByRole('status')).toHaveTextContent('Player 3 wins!');
  expect(screen.getByRole('button',{name:'Roll dice'})).toBeDisabled();
});

test('saved session resumes on refresh and retains identity', () => {
  sessionStorage.setItem('snake-ladder-session',JSON.stringify({roomId:'ABCDEF',token:'secret'}));
  render(<App />);
  expect(socket.emit).toHaveBeenCalledWith('resume-room',{roomId:'ABCDEF',token:'secret'},expect.any(Function));
  act(()=>socket.emit.mock.calls[0][2](null,{ok:true,playerId:'b',token:'secret',state:game}));
  expect(screen.getByText('You are Player 2')).toBeInTheDocument();
});
test('disconnect pauses play and rematch requires a request', () => {
  const {rerender}=render(<Game game={{...game,players:game.players.map((p,i)=>({...p,connected:i!==1}))}} playerId="a" connected />);
  expect(screen.getByRole('status')).toHaveTextContent('Paused');
  expect(screen.getByRole('button',{name:'Roll dice'})).toBeDisabled();
  rerender(<Game game={{...game,phase:'finished',winnerId:'a'}} playerId="a" connected />);
  fireEvent.click(screen.getByText('Play again'));
  expect(socket.emit).toHaveBeenCalledWith('rematch',{roomId:'ABCDEF'},expect.any(Function));
});
test('share link uses the hosting computer hostname from LAN metadata', async () => {
  global.fetch=jest.fn().mockResolvedValue({ok:true,json:async()=>({url:'http://Game-Host.local:3000'})});
  render(<Game game={game} playerId="a" connected />);
  await act(async()=>fireEvent.click(screen.getByText('Share room link')));
  expect(screen.getByText(/http:\/\/Game-Host\.local:3000\/\?room=ABCDEF/)).toBeInTheDocument();
  delete global.fetch;
});
test('muting stops audio, persists across visits, and unmuting only affects future rolls', () => {
  const play=jest.spyOn(HTMLMediaElement.prototype,'play').mockResolvedValue();
  const pause=jest.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>{});
  const rolled={...game,lastMove:{number:4,roll:2}};
  const view=render(<Game game={rolled} playerId="a" connected />);
  expect(play).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByText('Mute sound'));
  expect(pause).toHaveBeenCalledTimes(1);expect(localStorage.getItem('snake-ladder-muted')).toBe('true');
  view.rerender(<Game game={{...rolled,lastMove:{number:5,roll:3}}} playerId="a" connected />);
  expect(play).toHaveBeenCalledTimes(1);view.unmount();
  const next=render(<Game game={rolled} playerId="a" connected />);
  expect(screen.getByText('Unmute sound')).toBeInTheDocument();expect(play).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByText('Unmute sound'));
  expect(localStorage.getItem('snake-ladder-muted')).toBe('false');expect(play).toHaveBeenCalledTimes(1);
  next.rerender(<Game game={{...rolled,lastMove:{number:6,roll:4}}} playerId="a" connected />);
  expect(play).toHaveBeenCalledTimes(2);play.mockRestore();pause.mockRestore();
});
test('sound preference changes in another tab update this game',()=>{
  const {container}=render(<Game game={game} playerId="a" connected />);
  act(()=>{localStorage.setItem('snake-ladder-muted','true');window.dispatchEvent(new StorageEvent('storage',{key:'snake-ladder-muted',newValue:'true'}));});
  expect(screen.getByText('Unmute sound')).toBeInTheDocument();expect(container.querySelector('audio').muted).toBe(true);
});
