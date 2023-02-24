const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http');
var cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");
require('dotenv').config()

var PDFDocument = require('pdfkit');

const crypto = require('crypto');

const { write, read, add } = require("./db-manager")

const { Client, Environment, ApiError } = require('square');
const { create } = require('domain');
const path = require('path');

// Square Client
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production
});

// Socket Server
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

try {
  if (fs.existsSync("./db.json")) {
    console.log('yes')
  } else {
    fs.writeFileSync("db.json", JSON.stringify({items: []}))
  }
} catch (err) {
  console.error(err)
}

async function getReverbShop() {
  return new Promise((resolve, reject) => {
    const url = "https://sandbox.reverb.com/api/shop"

    const headers = {
      headers: {
        "content-type": "application/hal+json",
        "accept": "application/hal+json",
        "accept-version": "3.0",
        "authorization": "Bearer " + process.env.REVERB_ACCESS_TOKEN
      },
      method: "GET"
    }

    fetch(url, headers).then(data => { resolve(data.json()) }).catch(error => console.log(error));
  })
}

async function getReverbConditions() {
  return new Promise((resolve, reject) => {
    const url = "https://api.reverb.com/api/listing_conditions";

    const headers = {
      headers: {
        "content-type": "application/hal+json",
        "accept-version": "3.0",
      },
      method: "GET"
    }

    fetch(url, headers).then(data => { resolve(data.json()) }).catch(error => console.log(error));
  })
}

async function createReverbListing(data) {
  const reverbShop = await getReverbShop();
  const reverbConditions = await getReverbConditions();



  console.log(reverbShop.name)

  reverbConditions.conditions.map((condition) => {
    console.log(condition.display_name)
  })

}


async function createSquareItem(data) {

  data.items.map(async (item) => {
    var make = item.make;
    var model = item.model;

    var price = item.listPrice;

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

app.use(express.static(path.join(__dirname, "site")))

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "site/index.html"));
});

io.on('connection', async (socket) => {
  console.log('a user connected: ' + socket.id);

  socket.on("create-item", async (value) => {
    console.log(value);
    await createSquareItem(JSON.parse(value));
    
    add(value)

    io.to(socket.id).emit("created");

    io.emit("update", await read())
  })

  socket.on("request-update", (value) => {
    console.log("requested Update")
    io.to(socket.id).emit("update", JSON.parse(fs.readFileSync("db.json")))
  });

  socket.on("get-data", () => {

    io.to(socket.id).emit("data", JSON.parse(fs.readFileSync("db.json")).items)
  })

  socket.on("deleteItem", async (transactionID) => {
    var data = await JSON.parse(fs.readFileSync("db.json"))

    data.items.map(async (item, index) => {
      item = JSON.parse(item)

      if (item.transactionID == transactionID) {
        data.items = data.items.slice(index, 0)

        data = JSON.stringify(data);
        fs.writeFileSync('db.json', data);

        io.emit("delete-item", transactionID);
        io.emit("update", await read())
      }
    })
  })
});

server.listen(80, () => {
  console.log('listening on *:80');
});