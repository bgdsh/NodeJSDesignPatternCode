/**
 * Created by bgd on 16/7/22.
 */
AMQPRequest.prototype.request = function(queue, message, callback) {
    var id = uuid.v4();
    this.idToCallbackMap[id] = callback;
    this.channel.sendToQueue(queue,
        new Buffer(JSON.stringify(message)),
        {correlationId: id, replyTo: this.replyQueue}
    );
};
AMQPRequest.prototype._listenForResponses = function() {
    var self = this;
    return this.channel.consume(this.replyQueue, function(msg) {
        var correlationId = msg.properties.correlationId;
        var handler = self.idToCallbackMap[correlationId];
        if(handler) {
            handler(JSON.parse(msg.content.toString()));
        }
    });
};