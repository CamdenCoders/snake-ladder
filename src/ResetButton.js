function Button({onButtonClick}){

    return (
        <button onClick = {onButtonClick} className="text-white hover:bg-black font-semibold py-2 px-4 border rounded-lg transition hover:scale-105 hover:-translate-y-1">
            Reset
        </button>
    );
}



export default Button;