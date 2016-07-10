var path=require('path');
module.exports.urlToFilename=function (url) {
  return path.join(__dirname,"./data/"+url.replace(/\//,'-')+".txt");
}
