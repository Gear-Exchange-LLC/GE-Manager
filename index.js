const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http');
var cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");
require('dotenv').config()

const { write, read, add } = require("./db-manager")

const { Client, Environment, ApiError } = require('square');
const { create } = require('domain');

// Square Client
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox
});

// Socket Server
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});


async function createSquareItem() {
  try {
    const response = await client.catalogApi.upsertCatalogObject({
      idempotencyKey: 'hiuehuiewhfuihufhu',
      object: {
        type: 'ITEM',
        id: '#34weds',
        itemData: {
          name: 'Piaosoid',
          variations: [
            {
              type: 'ITEM_VARIATION',
              id: '#aojisdhios',
              itemVariationData: {
                sku: '123423',
                pricingType: 'FIXED_PRICING',
                ordinal: 1,
                priceMoney: {
                  amount: 20000,
                  currency: 'USD'
                },
                trackInventory: true
              }
            }
          ]
        }
      }
    });
  
    console.log(response.result);
  } catch(error) {
    console.log(error);
  }
}

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

  socket.on("get-data", () => {

    io.to(socket.id).emit("data", JSON.parse(fs.readFileSync("db.json")).items)
  })
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});