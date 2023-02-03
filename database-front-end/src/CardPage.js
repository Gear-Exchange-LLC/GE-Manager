import React, { useContext, useEffect, useState } from "react";
import './App.css';
import { SocketContext } from "./context/SocketContext";
import {
  useParams, useSearchParams
} from "react-router-dom";
import { useDeferredValue } from "react";

function CardPage() {

    const socket = useContext(SocketContext);

    const { id } = useParams();

    const [data, setData] = useState({});

    socket.emit("get-data");

    useEffect(() => {
      socket.on("data", (data) => {
        data.map((item) => {
          var item = JSON.parse(item)
          if (item.transactionID == id) {
            setData(item)
          }
        })
      })
    })

    return (
    <div className="CardPage">
      <h1 style={{color: "black"}}>{data.firstName}</h1>
    </div>
  );
}

export default CardPage;
