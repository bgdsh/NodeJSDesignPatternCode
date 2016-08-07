

var fs = require('fs');
var path = require('path');

asyncFlow(function* (callback) {
    var fileName = path.basename(__filename);
    var myself = yield fs.readFile(fileName, 'utf8', callback);
    yield fs.writeFile('clone_of_' + fileName, myself, callback);
    console.log('Clone created');
});