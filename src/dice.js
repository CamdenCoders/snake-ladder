import './dice.css';

export default function Dice({onDiceClick, number}){
    return (
        <div id="diceRoll" className="diceDiv" onClick={onDiceClick}>
            <div className="diceSq">
                {number}
            </div>
        </div>
                 
    );
}

