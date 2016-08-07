var path = require('path');
module.exports.urlToFilename = function (url) {
  return path.join(__dirname, "./data/" + url.replace(/http:\/\//, "") + ".txt");
}
module.exports.getPageLinks = function (currentUrl, body) {

}

var Promise = require('bluebird');

module.exports.promisify = function (callbackBasedApi) {
  return function promisified() {
    var args = [].slice.call(arguments);
    return new Promise(function (resolve, reject) {    //[1]
      args.push(function (err, result) {      //[2]
        if (err) {
          return reject(err);          //[3]
        }
        if (arguments.length <= 2) {        //[4]
          resolve(result);
        } else {
          resolve([].slice.call(arguments, 1));
        }
      });
      callbackBasedApi.apply(null, args);      //[5]
    });
  }
};