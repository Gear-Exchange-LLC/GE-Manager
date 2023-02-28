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
    var data = JSON.parse()

    console.log(await client.keys("*"))

    return data
}

module.exports.writeDatabase = async function (value) {
    return new Promise(async (resolve, reject) => {
        var data = JSON.parse(fs.readFileSync("db.json"));
        
        console.log(data);
        data.items.push(value);

        data = JSON.stringify(data);



        resolve(data);
    })
}