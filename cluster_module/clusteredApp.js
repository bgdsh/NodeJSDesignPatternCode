var cluster = require('cluster');
var os = require('os');

if(cluster.isMaster) {
  var cpus = os.cpus().length;
  //start as many children as the number of CPUs
  for (var i = 0; i < cpus; i++) {      //[1]
    cluster.fork();
  }
} else {
  require('./app');           //[2]
}
