const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http');
var cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");
require('dotenv').config()

const crypto = require('crypto');

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


async function createSquareItem(data) {

  data.items.map(async (item) => {
    var make = item.make;
    var model = item.model;

    var price = item.x;

    if (!price.includes(".")) {
      price = price + "00"
    }
    else {
      price = price.split(".")[0] + price.split(".")[1]
    }
  
    var stock = item.stock;

    var sku = item.sku;
  
    try {
      const objectResponse = await client.catalogApi.upsertCatalogObject({
        idempotencyKey: crypto.randomUUID(),
        object: {
          type: 'ITEM',
          id: '#create-item',
          itemData: {
            name: `(${sku}) ${make} ${model}`,
            variations: [
              {
                type: 'ITEM_VARIATION',
                id: '#create-item-varient',
                itemVariationData: {
                  sku: sku,
                  pricingType: 'FIXED_PRICING',
                  priceMoney: {
                    amount: price,
                    currency: 'USD'
                  },
                  trackInventory: true
                }
              }
            ]
          }
        }
      });
  
      const stockResponse = await client.inventoryApi.batchChangeInventory({
        idempotencyKey: crypto.randomUUID(),
        changes: [
          {
            type: 'PHYSICAL_COUNT',
            physicalCount: {
              catalogObjectId: objectResponse.result.catalogObject.itemData.variations[0].id,
              state: 'IN_STOCK',
              locationId: objectResponse.result.catalogObject.itemData.variations[0].itemVariationData.locationOverrides[0].locationId,
              quantity: stock.toString(),
              occurredAt: new Date().toISOString()
            }
          }
        ]
      });
  
    } catch(error) {
      console.log(error);
    }
  })
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
    console.log(value);
    await createSquareItem(JSON.parse(value));
    
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