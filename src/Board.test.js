import { render, screen, act } from '@testing-library/react';
import Board from './Board';
jest.mock('./socket',()=>({socket:{}}));
const game={players:[{id:'a',position:24}],ladders:[[6,24]],snakes:[],lastMove:{number:2,playerId:'a',from:1,landed:6,to:24,startedAt:10000,duration:1680}};
beforeEach(()=>{jest.useFakeTimers();jest.setSystemTime(10000);window.matchMedia=jest.fn(()=>({matches:false}));});
afterEach(()=>jest.useRealTimers());
test('token moves through roll squares then along ladder, without restarting on metadata updates',()=>{
 const {rerender,unmount}=render(<Board game={game}/>);
 const token=()=>screen.getByRole('img',{name:'Player 1, square 24'});
 expect(token().style.transform).toBe('translate(20px, 950px)');
 act(()=>jest.advanceTimersByTime(200));
 expect(token().style.transform).toBe('translate(220px, 950px)');
 rerender(<Board game={{...game,lastMove:{...game.lastMove},version:3}}/>);
 expect(token().style.transform).toBe('translate(220px, 950px)');
 act(()=>jest.advanceTimersByTime(1500));
 expect(token().style.transform).toBe('translate(320px, 750px)');
 unmount();expect(jest.getTimerCount()).toBe(0);
});
test('reduced motion renders authoritative destination immediately',()=>{
 window.matchMedia.mockReturnValue({matches:true});render(<Board game={game}/>);
 expect(screen.getByRole('img',{name:'Player 1, square 24'}).style.transform).toBe('translate(320px, 750px)');
 expect(jest.getTimerCount()).toBe(0);
});
test('player holds its starting square until the dice has landed',()=>{
 const delayed={...game,lastMove:{...game.lastMove,diceMs:1500,duration:3180}};
 render(<Board game={delayed}/>);
 const token=()=>screen.getByRole('img',{name:'Player 1, square 24'});
 act(()=>jest.advanceTimersByTime(1499));expect(token().style.transform).toBe('translate(20px, 950px)');
 act(()=>jest.advanceTimersByTime(200));expect(token().style.transform).not.toBe('translate(20px, 950px)');
});
