const express = require('express');
const app = express();
const http = require('http');
var cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");
require('dotenv').config()

const redis = require('redis');

const pdf = require('html-pdf');

const { print } = require('pdf-to-printer');

const client = redis.createClient(6379);

const { exec } = require('child_process');

var PDFDocument = require('pdfkit');

const crypto = require('crypto');

const { writeDatabase, readDatabase, connectDatabase, deleteDatabase } = require("./db-manager")

const { Client, Environment, ApiError } = require('square');
const { create } = require('domain');
const path = require('path');
const { read, file } = require('pdfkit');

// Square Client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production
});
// Socket Server
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

const reverbAPIUrl = "https://api.reverb.com/api/listings"

// async function createSquareLabel() {
//   // write me a function that makes a pdf file that has the item name, sku and price from square catelog item json array

//   const catalogObject = await squareClient.catalogApi.retrieveCatalogObject("Q2F0YWxvZ0JvYXJkOjEwMjU5NjU5NjU2MzY=");
//   const item = catalogObject.object.item_data;

//   const doc = new PDFDocument();

//   doc.pipe(fs.createWriteStream('output.pdf'));

//   doc.fontSize(25)
//     .text(`${item.name}`, 100, 100);
  
//   doc.fontSize(25)
//     .text(`SKU: ${item.variations[0].sku}`, 100, 200);
  
//   doc.fontSize(25)
//     .text(`Price: $${item.variations[0].price_money.amount / 100}`, 100, 300);

//   doc.end();

//   // save the document to a file
//   doc.pipe(fs.createWriteStream('output.pdf'));

//   return doc;
// }

// createSquareLabel()

async function createReverbListing(item) {
  return new Promise((resolve, reject) => {
    const url = reverbAPIUrl

    const data = {
      make: item.make,
      model: item.model,
      categories: [{
        "uuid": item.category
      }],
      condition: {
          "uuid": item.condition
      },
      photos: [],
      description: `${item.make} ${item.model}`,
      price: {
          amount: item.listPrice.includes(".") ? item.listPrice : item.listPrice + ".00",
          currency: "USD"
      },
      title: `(${item.sku}) ${item.make} ${item.model}`,
      sku: item.sku,
      upc_does_not_apply: "true",
      has_inventory: true,
      inventory: item.stock,
      offers_enabled: false,
      handmade: false,
  }

    const headers = {
      headers: {
        "content-type": "application/hal+json",
        "accept": "application/hal+json",
        "accept-version": "3.0",
        "authorization": "Bearer " + process.env.REVERB_ACCESS_TOKEN
      },
      body: JSON.stringify(data),
      method: "POST"
    }

    fetch(url, headers).then(data => { resolve(data.json()) }).catch(error => console.log(error));
  })
}

async function getSquareData() {
  let cursor = '';
  let hasMoreItems = true;
  let items = [];

  while (hasMoreItems) {
    const response = await squareClient.catalogApi.listCatalog(cursor);
    const { objects, cursor: nextCursor } = response;
    items = items.concat(objects);

    if (!nextCursor) {
      hasMoreItems = false;
    } else {
      cursor = nextCursor;
    }
  }

  // Sort items by SKU
  items.sort((a, b) => {
    const variationA = a.item_data.variations[0];
    const variationB = b.item_data.variations[0];
    if (variationA && variationB) {
      const skuA = variationA.sku ? variationA.sku.toUpperCase() : '';
      const skuB = variationB.sku ? variationB.sku.toUpperCase() : '';
      if (skuA < skuB) {
        return -1;
      }
      if (skuA > skuB) {
        return 1;
      }
    }
    return 0;
  });

  console.log(items);
}

async function createReverb(data) {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      
      await createReverbListing(item)

      resolve()
    }
  })
}


async function createSquareItem(data) {

  data.items.map(async (item, i) => {
    setTimeout(async () => {
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
        const objectResponse = await squareClient.catalogApi.upsertCatalogObject({
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
  
        const stockResponse = await squareClient.inventoryApi.batchChangeInventory({
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
    }, i * 1000)
  })
}

app.use(cors())

app.use(express.static(path.join(__dirname, "Site")))
app.use(express.static(path.join(__dirname, "barcodeFont")))

app.get('/barcodeFont.ttf', (req, res) => {
  res.sendFile(path.join(__dirname, "barcodeFont/free3of9.ttf"));
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "site/index.html"));
});

io.on('connection', async (socket) => {
  console.log('a user connected: ' + socket.id);

  socket.on("create-item", async (value) => {
    console.log(value);
    await createSquareItem(JSON.parse(value));
    
    await writeDatabase(value);

    io.to(socket.id).emit("created");

    io.emit("update", await readDatabase())
  })

  socket.on("set-complete", async (data) => {
    data.completed = !data.completed;

    await writeDatabase(JSON.stringify(data));

    socket.emit("data", await readDatabase())
    io.emit("update", await readDatabase())
  });

  socket.on("request-update", async (value) => {
    console.log("requested Update")

    const data = await readDatabase();
    io.to(socket.id).emit("update", data)
  });

  socket.on("get-data", async () => {
    const data = await readDatabase()
    io.to(socket.id).emit("data", data)
  })

  socket.on("create-reverb", async (data) => {
    await createReverb(data)

    data.reverbCreated = true;

    await writeDatabase(JSON.stringify(data));

    socket.emit("reverb")
    socket.emit("data", await readDatabase())
    io.emit("update", await readDatabase())
    console.log("Create Reverb")
  })

  socket.on("deleteItem", async (transactionID) => {

    await deleteDatabase(transactionID)

    socket.emit("delete-item", transactionID);
    io.emit("update", await readDatabase())
  })
});

server.listen(80, () => {
  console.log('listening on *:80');
  connectDatabase()
});