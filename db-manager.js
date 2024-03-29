 const redis = require("redis");

const client = redis.createClient()

client.on("connect", () => {
    console.log("Connected to database")
})

module.exports.connectDatabase = async function () {
    await client.connect();
}

module.exports.readDatabase = async function () {
    return new Promise(async (resolve, reject) => {
        var keys = await client.keys("*");

        var data = []

        for (let i = 0; i < keys.length; i++) {
            const value = JSON.parse(await client.get(keys[i]));

            if (keys[i] != "currentSKU") {
                data.push(JSON.stringify(value));
            }
        }

        resolve(data)
    })
}

module.exports.readDatabaseSKU = async function () {
    return new Promise(async (resolve, reject) => {
        // get value of key currentSKU
        var currentSKU = await client.get("currentSKU");

        // if currentSKU is null, set it to 0
        if (currentSKU == null) {
            await client.set("currentSKU", 0);

            currentSKU = 0;
        }
        

        // return new value
        resolve(currentSKU);
    })
}

module.exports.setDatabaseSKU = async function (sku) {
    return new Promise(async (resolve, reject) => {
        // set value of key currentSKU
        await client.set("currentSKU", sku);

        resolve();
    })
}

module.exports.writeDatabase = async function (value) {
    return new Promise(async (resolve, reject) => {

        value = JSON.parse(value)

        await client.set(value.transactionID, JSON.stringify(value));

        var keys = await client.keys("*");

        var data = []

        for (let i = 0; i < keys.length; i++) {
            const item = JSON.parse(await client.get(keys[i]));

            data.push(JSON.stringify(item));
        }

        resolve(data);
    })
}

module.exports.deleteDatabase = async function (key) {
    return new Promise(async (resolve, reject) => {

        await client.del(key);

        resolve();
    })
}