var request=require('request');
var fs=require('fs');
var mkdirp=require('mkdirp');
var path=require('path');
var utilities=require('./utilities');

function saveFile(filename,contents,callback) {
  mkdirp(path.dirname(filename),function(err){
    if(err){
      return callback(err);
    }
    fs.writeFile(filename,contents,callback);
  })
}
function download(url,filename,callback) {
  console.log('Downloading'+url+'\n');
  request(url,function(err,response,body){
    if(err){
      return callback(err);
    }
    saveFile(filename,body,function(err){
      console.log('Downloading and saved :'+url+'\n');
      if(err){
        return callback(err);
      }
      callback(null,filename);
    })
  })
}

function spiderLinks(currentUrl,body,nesting,callback) {
  if(nesting===0){
    return process.nextTick(callback);
  }
  var links=utilities.getPageLinks(currentUrl,body);
  function iterate(index){
    if(index===links.length){
      return callback();
    }
    spider(links[index],nesting-1,function (err) {
      if(err){
        return callback(err);
      }
      iterate(index+1);
    })
  }
  iterate(0);
}

function spider(url, nesting, callback) {
  var filename=utilities.urlToFilename(url);
  fs.readFile(filename,'utf8',function (err,body) {
    if(err){
      if(err.code!=='ENOENT'){
        return callback(err);
      }
      return download(url,filename,function (err,body) {
        if(err){
          return callback(err);
        }
        spiderLinks(url,body,nesting,callback);
      })
    }
    spiderLinks(url,body,nesting,callback);
  })
}

spider(process.argv[2],function (err,filename,downloaded) {
  if(err){
    console.log(err);
  }else if(downloaded){
    console.log('Completed the download of "'+filename+'"')
  }else{
    console.log('"'+filename+'"was already downloaded')
  }
})
