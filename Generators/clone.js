function asyncFlow(generatorFunction) {
    function callback(err) {
        if (err) {
            return generator.throw(err);
        }
        var results = [].slice.call(arguments, 1);
        generator.next(results.length > 1 ? results : results[0]);
    };
    var generator = generatorFunction(callback);
    generator.next();
}

var fs = require('fs');
var path = require('path');

asyncFlow(function* (callback) {
    var fileName = path.basename(__filename);
    var myself = yield fs.readFile(fileName, 'utf8', callback);
    yield fs.writeFile('clone_of_' + fileName, myself, callback);
    console.log('Clone created');
});

function asyncFlowWithThunks(generatorFunction) {
    function callback(err) {
        if (err) {
            return generator.throw(err);
        }
        var results = [].slice.call(arguments, 1);
        var thunk = generator.next(results.length > 1 ? results : results[0]).value;
        thunk && thunk(callback);
    };
    var generator = generatorFunction();
    var thunk = generator.next().value;
    thunk && thunk(callback);
}

asyncFlowWithThunks(function* () {
    var myself = yield readFileThunk(__filename, 'utf8');
    yield writeFileThunk("clone of clone.js", myself);
    console.log("Clone created");
});