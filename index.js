const express = require('express');
const app = express();
const http = require('http');
var cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");

const { write, read, add } = require("./db-manager")

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors())

app.get('/', (req, res) => {
    write("test", "tesransdji");
    res.send('/index.html');
});

io.on('connection', async (socket) => {
  console.log('a user connected');

  socket.emit("update", read())

  socket.on("create-item", (value) => {
    add(value).then((value) => {
        socket.to(socket.id).emit("created");

        socket.emit("update", )
    })
  })
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});