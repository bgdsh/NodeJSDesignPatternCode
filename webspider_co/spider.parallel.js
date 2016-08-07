var thunkify = require('thunkify');
var co = require('co');

var request = thunkify(require('request'));
var fs = require('fs');
var mkdirp = thunkify(require('mkdirp'));
var readFile = thunkify(fs.readFile);
var writeFile = thunkify(fs.writeFile);
var nextTick = thunkify(process.nextTick);

function* download(url, filename) {
    console.log('Downloading ' + url);
    var results = yield request(url);
    var body = results[1];
    yield mkdirp(path.dirname(filename));
    yield writeFile(filename, body);
    console.log('Downloaded and saved:' + url);
    return body;
}

function* spider(url, nesting) {
    var filename = utilities.urlToFilename(url);
    var body;
    try {
        body = yield readFile(filename, 'utf8');
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
        body = yield download(url, filename);
    }
    yield spiderLinks(url, body, nesting);
}

function* spiderLinks(currentUrl, body, nesting) {
    if (nesting === 0) {
        return nextTick();
    }

    var links = utilities.getPageLinks(currentUrl, body);
    var tasks = links.map(function (link) {
        return spider(link, nesting - 1);
    });
    yield tasks;
}

function spiderLinks(currentUrl, body, nesting) {
    if (nesting === 0) {
        return nextTick();
    }

    //returns a thunk
    return function (callback) {
        var completed = 0, errored = false;
        var links = utilities.getPageLinks(currentUrl, body);
        if (links.length === 0) {
            return process.nextTick(callback);
        }

        function done(err, result) {
            if (err && !errored) {
                errored = true;
                callback(err);
            }
            if (++completed === links.length && !errored) {
                callback();
            }
        }

        for (var i = 0; i < links.length; i++) {
            co(spider(links[i], nesting - 1))(done);
        };
    }
}

co(function* () {
    try {
        yield spider(process.argv[2], 1);
        console.log('Download complete');
    } catch (err) {
        console.log(err);
    };
})();

// node --harmony-generators spider <URL>
