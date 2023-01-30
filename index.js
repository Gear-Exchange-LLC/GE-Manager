const express = require('express');
const app = express();
const fs = require('fs');
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
  console.log('a user connected: ' + socket.id);

  io.to(socket.id).emit("update", JSON.parse(fs.readFileSync("db.json")))

  socket.on("create-item", async (value) => {
    add(value)

    io.to(socket.id).emit("created");

    io.emit("update", await read())
  })
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});