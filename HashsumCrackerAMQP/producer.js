/**
 * Created by bgd on 16/7/22.
 */
var amqp = require('amqplib');
//[...]

var connection, channel;
amqp
    .connect('amqp://localhost')
    .then(function (conn) {
        connection = conn;
        return conn.createChannel();
    })
    .then(function (ch) {
        channel = ch;
        produce();
    })
    .catch(function (err) {
        console.log(err);
    });

function produce() {
    //[...]
    variationsStream(alphabet, maxLength)
        .on('data', function (combination) {
            //[...]
            var msg = {searchHash: searchHash, variations: batch};
            channel.sendToQueue('jobs_queue',
                new Buffer(JSON.stringify(msg)));
            //[...]
        });
}

//[...]
