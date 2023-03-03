const fs = require('fs');
const { resolve } = require('path');

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

            data.push(JSON.stringify(value));
        }

        resolve(data)
    })
}

module.exports.writeDatabase = async function (value) {
    return new Promise(async (resolve, reject) => {

        console.log(value);

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