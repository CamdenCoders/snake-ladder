import './dice.css';

export default function Dice({onDiceClick, number}){
    return (
        <div id="diceRoll" className=" text-black cursor-pointer grid translate-x-3/4 sm:translate-x-28 sm:absolute sm:top-1/3 sm:right-1/4 justify-center place-content-center w-16 h-16 border-1 border-red-500 p-5 rounded-lg" onClick={onDiceClick}>
                <p className='font-unbounded text-center text-white text-4xl mt-3 font-bold'>
                {number}
                </p>    
        </div>
                 
    );
}

