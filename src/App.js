import './App.css';
import Game from './Game';

function Header(){
return(

    <div>
      <h1 className="text-red-500">Snakes and Ladders</h1>
    </div>
  
);
}


function App() {
  return (<>
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Header/>
      <Game/>
    </div>
  </>
  );
}

export default App;