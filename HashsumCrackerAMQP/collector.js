/**
 * Created by bgd on 16/7/22.
 */
//[...]
.then(function(ch) {
    channel = ch;
    return channel.assertQueue('results_queue');
})
.then(function(q) {
    queue = q.queue;
    channel.consume(queue, function(msg) {
        console.log('Message from worker: ', msg.content.toString());
    });
})
//[...]