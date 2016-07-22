/**
 * Created by bgd on 16/7/22.
 */

module.exports = function (channel) {
    return function registerHandler(handler) {
        channel.on('message', function (message) { //[1]
            if (message.type !== 'request') return;

            handler(message.data, function (reply) {
                channel.send({             //[2]
                    type: 'response',
                    data: reply,
                    inReplyTo: message.id
                });
            });
        });
    };
};