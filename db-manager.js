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
        var data = JSON.parse(fs.readFileSync("db copy.json"));

        resolve(data);
    })
}

module.exports.writeDatabase = async function (value) {
    return new Promise(async (resolve, reject) => {
        var data = JSON.parse(fs.readFileSync("db copy.json"));
        
        console.log(data);
        data.items.push(value);

        data = JSON.stringify(data);



        resolve(data);
    })
}