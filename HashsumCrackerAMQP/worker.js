/**
 * Created by bgd on 16/7/22.
 */
var amqp = require('amqplib');
//[...]

var channel, queue;
amqp
    .connect('amqp://localhost')
    .then(function(conn) {
        return conn.createChannel();
    })
    .then(function(ch) {
        channel = ch;
        return channel.assertQueue('jobs_queue');
    })
    .then(function(q) {
        queue = q.queue;
        consume();
    });

    //[...]
function consume() {
    channel.consume(queue, function(msg) {
        //[...]
        variations.forEach(function(word) {
            //[...]
            if(digest === data.searchHash) {
                console.log('Found! => ' + word);
                channel.sendToQueue('results_queue',
                    new Buffer('Found! ' + digest + ' => ' + word));
            }
            //[...]
        });
        channel.ack(msg);
    });
}
