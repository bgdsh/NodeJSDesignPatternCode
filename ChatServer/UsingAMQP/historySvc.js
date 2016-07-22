/**
 * Created by bgd on 16/7/20.
 */
var level = require('level');
var timestamp = require('monotonic-timestamp');
var JSONStream = require('JSONStream');
var db = level('./msgHistory');
var amqp = require('amqplib');

//HTTP server for querying the chat history
require('http').createServer(function (req, res) {
    res.writeHead(200);
    db.createValueStream()
        .pipe(JSONStream.stringify())
        .pipe(res);
}).listen(8090);

var channel, queue;
amqp
    .connect('amqp://localhost')  //[1]
    .then(function (conn) {
        return conn.createChannel();
    })
    .then(function (ch) {
        channel = ch;
        return channel.assertExchange('chat', 'fanout'); //[2]
    })
    .then(function () {
        return channel.assertQueue('chat_history'); //[3]
    })
    .then(function (q) {
        queue = q.queue;
        return channel.bindQueue(queue, 'chat');  //[4]
    })
    .then(function () {
        return channel.consume(queue, function (msg) {  //[5]
            var content = msg.content.toString();
            console.log('Saving message: ' + content);
            db.put(timestamp(), content, function (err) {
                if (!err) channel.ack(msg);
            });
        });
    })
    .catch(function (err) {
        console.log(err);
    });