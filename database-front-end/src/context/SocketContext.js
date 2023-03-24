import socketio from "socket.io-client";
import React from "react"

export const socket = socketio.connect("http://192.168.50.218:80");
// export const socket = socketio.connect("http://localhost:80");
export const SocketContext = React.createContext();