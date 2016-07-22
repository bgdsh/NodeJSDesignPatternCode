/**
 * Created by bgd on 16/7/22.
 */
function AMQPReply(){

}
AMQPReply.prototype.handleRequest = function (handler) {
    var self = this;
    return self.channel.consume(self.queue, function (msg) {
        var content = JSON.parse(msg.content.toString());
        handler(content, function (reply) {
            self.channel.sendToQueue(
                msg.properties.replyTo,
                new Buffer(JSON.stringify(reply)),
                {correlationId: msg.properties.correlationId}
            );
            self.channel.ack(msg);
        });
    });
};