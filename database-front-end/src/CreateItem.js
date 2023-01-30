import React, { useState, useEffect, useContext } from "react";
import './App.css';
import socketIOClient from "socket.io-client";
import { createBrowserHistory } from "@remix-run/router";
import { SocketContext } from "./context/SocketContext";

function CreateItem() {
  
  const socket = useContext(SocketContext);

  const [date, setDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [FirstName, setFirstName] = React.useState();
  const [MiddleName, setMiddleName] = React.useState();
  const [LastName, setLastName] = React.useState();
  const [DriversLicenseNum, setDriversLicenseNum] = React.useState();
  const [PhoneNumber, setPhoneNumber] = React.useState();
  const [StoreCredit, setStoreCredit] = React.useState(false);
  const [SellCheck, setSellCheck] = React.useState(false);
  const [TransactionID, setTransactionID] = React.useState();
  const [PONum, setPONum] = React.useState();
  const [items, setItems] = React.useState([]);

  function createItem() {
    const value = { date: date, timeCreated: new Date().toISOString(), firstName: FirstName, middleName: MiddleName, lastName: LastName, driversLicense: DriversLicenseNum, phoneNumber: PhoneNumber, storeCredit: StoreCredit, sell: SellCheck, transactionID: TransactionID, poNum: PONum, items: items }

    console.log(value);

    socket.emit("create-item", JSON.stringify(value))
  }

  useEffect(() => {
    socket.on("created", (socket) => {
        window.location.href = "/dashboard"
    })
  })

  return (
    <div className="App">
      <div className="InputWrapper">
        <div className="InputItem">
            <p>Date:</p>
            <input type="date" value={`${date}`} onChange={(event) => setDate(event.target.value)}/>
          </div>
        <div className="InputItem">
          <p>First Name:</p>
          <input type="text" onChange={(event) => setFirstName(event.target.value)}/>
        </div>
        <div className="InputItem">
          <p>MI:</p>
          <input type="text" onChange={(event) => setMiddleName(event.target.value)}/>
        </div>
        <div className="InputItem">
          <p>Last Name:</p>
          <input type="text" onChange={(event) => setLastName(event.target.value)}/>
        </div>
        <div className="InputItem">
          <p>Drivers License #:</p>
          <input type="text" onChange={(event) => setDriversLicenseNum(event.target.value)}/>
        </div>
        <div className="InputItem">
          <p>Phone Number:</p>
          <input type="number" onChange={(event) => setPhoneNumber(event.target.value)}/>
        </div>
        <div className="InputItem">
          <p>Store Credit:</p>
          <input type="checkbox" onChange={(event) => {
            if (event.target.value == "on") {
              setStoreCredit(true)
            } else {
              setStoreCredit(false)
            }
          }}/>
        </div>
        <div className="InputItem">
          <p>Sell:</p>
          <input type="checkbox" onChange={(event) => {
            if (event.target.value == "on") {
              setSellCheck(true)
            } else {
              setSellCheck(false)
            }
          }}/>
        </div>
        <div className="InputItem">
          <p>Transaction ID:</p>
          <input type="number" onChange={(event) => setTransactionID(event.target.value)}/>
        </div>
        <div className="InputItem">
          <p>PO #:</p>
          <input type="number" onChange={(event) => setPONum(event.target.value)}/>
        </div>
        <input type="button" className='submitButton' value="Submit" onClick={() => createItem()} />
      </div>
    </div>
  );
}

export default CreateItem;
