const fs = require('fs');

async function getItems() {
    return fs.readFile('db.json', (err, data) => {
        data = JSON.parse(data);
        console.log(data)
        return data
    })
}

module.exports.edit = function (key, value) {
    var data = getItems();

    if (!data[key]) {
        console.log(`Key: ${key} NOT Found`)
        return;
    }

    data[key] = value;

    data = JSON.stringify(data);
    fs.writeFileSync('db.json', data);
}

module.exports.read = async function () {
    var data = await getItems();

    return data
}

module.exports.add = async function (value) {
    return new Promise(async (resolve, reject) => {
        var data = await getItems();
        
        console.log(data);
        data.push(value);

        data = JSON.stringify(data);
        fs.writeFileSync('db.json', data);

        resolve(data);
    })
}