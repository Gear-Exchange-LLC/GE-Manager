const fs = require('fs');

function getData() {
    let rawdata = fs.readFileSync('db.json');
    let data = JSON.parse(rawdata);
    return data
}

module.exports.write = function (key, value) {
    var data = getData();

    if (!data[key]) {
        console.log(`Key: ${key} NOT Found`)
        return;
    }

    data[key] = value;

    data = JSON.stringify(data);
    fs.writeFileSync('db.json', data);
}