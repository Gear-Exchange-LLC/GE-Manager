const fs = require('fs');
const { resolve } = require('path');

module.exports.edit = function (key, value) {
    var data = JSON.parse(fs.readFileSync("db.json"));

    if (!data[key]) {
        console.log(`Key: ${key} NOT Found`)
        return;
    }

    data[key] = value;

    data = JSON.stringify(data);
    fs.writeFileSync('db.json', data);
}

module.exports.read = async function () {
    var data = JSON.parse(fs.readFileSync("db.json"));

    return data
}

module.exports.add = async function (value) {
    return new Promise(async (resolve, reject) => {
        var data = JSON.parse(fs.readFileSync("db.json"));
        
        console.log(data);
        data.items.push(value);

        data = JSON.stringify(data);
        fs.writeFileSync('db.json', data);

        resolve(data);
    })
}