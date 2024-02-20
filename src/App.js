import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

function Square(){
  return (
  <div className="square">

  </div>
  
  );
}

function Row(){
  let row = [];
  for(let i=0; i<10; i++)
  {
    row.push(<Square/>);
  }
  return(
    
    <div style={{display: "flex"}}>
     {row}
    </div>
  );
}

function Board(){
  
  let row1 = [];
  for(let i=0; i<10; i++)
  {
    row1.push(<Row/>);
  }
  // for(let i=0;i<10; i++)
  // {
  //   col.innerHTML += row;
  // }

  return (
    <Container className="p-3">
      <div className="board">
      {row1}
      </div>
    </Container>
  );
}

function Header(){
return(

    <div>
          <h1 style={{color: "white"}}>Snakes and Ladders</h1>
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
      <Board/>
    </div>
  </>
  );
}

export default App;
