/**
 * Created by bgd on 16/7/21.
 */

var zmq = require('zmq');
var variationsStream = require('variations-stream');
var alphabet = 'abcdefghijklmnopqrstuvwxyz';
var batchSize = 10000;
var maxLength = process.argv[2];
var searchHash = process.argv[3];

var ventilator = zmq.socket('push');   //[1]
ventilator.bindSync("tcp://*:5000");

var batch = [];
variationsStream(alphabet, maxLength)
    .on('data', function (combination) {
        batch.push(combination);
        if (batch.length === batchSize) {  //[2]
            var msg = {searchHash: searchHash, variations: batch};
            ventilator.send(JSON.stringify(msg));
            batch = [];
        }
    })
    .on('end', function () {
        //send remaining combinations
        var msg = {searchHash: searchHash, variations: batch};
        ventilator.send(JSON.stringify(msg));
    });