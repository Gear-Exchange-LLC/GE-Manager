import React, { useContext, useEffect } from "react";
import './App.css';
import { SocketContext } from "./context/SocketContext";

function Dashboard() {

    const socket = useContext(SocketContext);

    const [data, setData] = React.useState([]);

    useEffect(() => {
        socket.on("update", (socket) => {
            setData(socket)
        })
      })

    return (
    <div className="Dashboard">
      <div className="CardWrapper">
        {data.map(function (value, index, array) {
            return (
                <div className="Card" key={index}>
                    <h1 className="Card-Title">{`${value.firstName} ${value.lastName}`}</h1>
                </div>
            )
            
        })}
      </div>
    </div>
  );
}

export default Dashboard;
