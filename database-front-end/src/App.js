import React, { useState, useEffect } from "react";
import './App.css';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3001";

const socket = socketIOClient(ENDPOINT);

function App() {

  const [brand, setBrand] = React.useState("");

  useEffect(() => {
    socket.on("update", (socket) => {
      
    })
  })

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
