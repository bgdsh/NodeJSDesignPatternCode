/**
 * Created by bgd on 16/7/22.
 */

var uuid = require('node-uuid');

module.exports = function (channel) {
    var idToCallbackMap = {};        //[1]

    channel.on('message', function (message) {   //[2]
        var handler = idToCallbackMap[message.inReplyTo];
        if (handler) {
            handler(message.data);
        }
    });

    return function sendRequest(req, callback) {  //[3]
        var correlationId = uuid.v4();
        idToCallbackMap[correlationId] = callback;
        channel.send({
            type: 'request',
            data: req,
            id: correlationId
        });
    };
};