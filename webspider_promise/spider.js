var Promise = require('bluebird');
var utilities = require('./utilities');

var request = utilities.promisify(require('request'));
var mkdirp = utilities.promisify(require('mkdirp'));
var fs = require('fs');
var readFile = utilities.promisify(fs.readFile);
var writeFile = utilities.promisify(fs.writeFile);

function saveFile(filename, contents, callback) {
    mkdirp(path.dirname(filename), function (err) {
        if (err) {
            return callback(err);
        }
        fs.writeFile(filename, contents, callback);
    })
}
function download(url, filename) {
    console.log('Downloading ' + url);
    var body;
    return request(url)
        .then(function (results) {
            body = results[1];
            return mkdirp(path.dirname(filename));
        })
        .then(function () {
            return writeFile(filename, body);
        })
        .then(function () {
            console.log('Downloaded and saved: ' + url);
            return body;
        });
}



function spiderLinksParallel(currentUrl, body, nesting) {
    var promise = Promise.resolve();        //[1]
    if (nesting === 0) {
        return promise;
    }
    var links = utilities.getPageLinks(currentUrl, body);
    links.forEach(function (link) {        //[2]
        promise = promise.then(function () {
            return spider(link, nesting - 1);
        });
    });

    return promise;
}

// 并行版
function spiderLinks(currentUrl, body, nesting) {
    if (nesting === 0) {
        return Promise.resolve();
    }

    var links = utilities.getPageLinks(currentUrl, body);
    var promises = links.map(function (link) {
        return spider(link, nesting - 1);
    });

    return Promise.all(promises);
}

function spider(url, nesting) {
    var filename = utilities.urlToFilename(url);
    return readFile(filename, 'utf8')
        .then(
        function (body) {
            return spiderLinks(url, body, nesting);
        },
        function (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }

            return download(url, filename)
                .then(function (body) {
                    return spiderLinks(url, body, nesting);
                });
        }
        );
}

spider(process.argv[2], 1)
    .then(function () {
        console.log('Download complete');
    })
    .catch(function (err) {
        console.log(err);
    });