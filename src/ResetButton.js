function Button({onButtonClick}){

    return (
        <button onClick = {onButtonClick} 
        className="mt-3 sm:absolute sm:-translate-x-18 sm:-ml-2 sm:top-52 sm:-translate-y-5 bg-white text-black py-2 px-4 border rounded-lg 
        transition hover:scale-105 hover:-translate-y-6">
            Reset
        </button>
    );
}



export default Button;