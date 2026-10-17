import {render,screen,fireEvent} from '@testing-library/react';
import Dice from './dice';
import gsap from 'gsap';
jest.mock('gsap',()=>({__esModule:true,default:{timeline:jest.fn(),set:jest.fn()}}));
const move={number:1,roll:3,diceMs:1500,startedAt:10000};
let timeline;
beforeEach(()=>{jest.useFakeTimers();jest.setSystemTime(10000);jest.clearAllMocks();window.matchMedia=jest.fn(()=>({matches:false}));timeline={fromTo:jest.fn(),seek:jest.fn(),kill:jest.fn()};gsap.timeline.mockReturnValue(timeline);});
afterEach(()=>jest.useRealTimers());
test('a single forward spin lands on the result and does not restart on metadata',()=>{
 const click=jest.fn();const {rerender,unmount}=render(<Dice number={3} move={move} onDiceClick={click}/>);
 expect(timeline.fromTo).toHaveBeenCalledTimes(1);
 expect(timeline.fromTo).toHaveBeenCalledWith(expect.anything(),{rotateX:0,rotateY:0,transformOrigin:'50% 50%'},expect.objectContaining({rotateX:270,rotateY:0,duration:1.5}));
 fireEvent.click(screen.getByRole('button',{name:'Roll dice'}));expect(click).toHaveBeenCalledTimes(1);
 rerender(<Dice number={3} move={{...move}}/>);expect(gsap.timeline).toHaveBeenCalledTimes(1);
 rerender(<Dice number={3} move={{...move,number:2}}/>);expect(gsap.timeline).toHaveBeenCalledTimes(2);
 const [,start,target]=timeline.fromTo.mock.calls[1];expect(target.rotateX).toBeGreaterThan(start.rotateX);expect(target.rotateY).toBeGreaterThanOrEqual(start.rotateY);
 unmount();expect(timeline.kill).toHaveBeenCalledTimes(2);
});
test('all six values land on the matching fixed cube face',()=>{
 const angles={1:[0,0],2:[0,270],3:[270,0],4:[90,0],5:[0,90],6:[0,180]};
 for(let roll=1;roll<=6;roll++) {
   const {unmount}=render(<Dice number={roll} move={{...move,roll}}/>);
   const target=timeline.fromTo.mock.calls.at(-1)[2];
   expect([target.rotateX%360,target.rotateY%360]).toEqual(angles[roll]);unmount();
 }
});
test('recovery seeks current spin and reduced motion directly shows the final orientation',()=>{
 jest.setSystemTime(11000);const {rerender}=render(<Dice number={3} move={move}/>);expect(timeline.seek).toHaveBeenCalledWith(1);
 window.matchMedia.mockReturnValue({matches:true});rerender(<Dice number={3} move={{...move,number:2}}/>);
 expect(gsap.timeline).toHaveBeenCalledTimes(1);expect(gsap.set).toHaveBeenCalledWith(expect.anything(),expect.objectContaining({rotateX:270,rotateY:0}));
});
