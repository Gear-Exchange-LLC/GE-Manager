import logo from './logo.svg';
import React from "react";
import './App.css';

function App() {

  const [brand, setBrand] = React.useState("");

  return (
    <div className="App">
      <div className="Wrapper">
        <div className="InputItem">
          <p>Brand:</p>
          <input type="text" onChange={(event) => setBrand(event.target.value)}/>
        </div>
        <div className="InputItem">
          <p>Model:</p>
          <input type="text" onChange={(event) => setBrand(event.target.value)}/>
        </div>
        <div className="InputItem">
          <p>SKU:</p>
          <input type="text" onChange={(event) => setBrand(event.target.value)}/>
        </div>
        <div className="InputItem">
          <p>Price:</p>
          <input type="text" onChange={(event) => setBrand(event.target.value)}/>
        </div>
        <div className="InputItem">
          <p>Condition:</p>
          <input type="text" onChange={(event) => setBrand(event.target.value)}/>
        </div>
        <input type="button" className='submitButton' value="Submit" onClick={() => console.log(brand)} />
      </div>
    </div>
  );
}

export default App;
