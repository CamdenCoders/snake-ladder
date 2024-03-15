import './App.css';
import Game from './Game';




function App() {
  return (<>
    <div className="text-center bg-black h-screen sm:h-4/5 font-quicksand font-semibold">
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
      
      <Game/>
    </div>
  </>
  );
}

export default App;