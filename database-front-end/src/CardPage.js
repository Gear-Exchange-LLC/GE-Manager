import React, { useContext, useEffect } from "react";
import './App.css';
import { SocketContext } from "./context/SocketContext";

function CardPage() {

    const socket = useContext(SocketContext);

    return (
    <div className="CardPage">

    </div>
  );
}

export default CardPage;
