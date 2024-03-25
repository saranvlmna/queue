//docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management
var amqp = require("amqplib/callback_api");
amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    // connect creted queue
    var queue = "newTask";
    channel.assertQueue(queue, {
      durable: true,
    });
    //fetch tasks in queue
    channel.consume(
      queue,
      function (task) {
        //proccess and next
        var secs = 10;
        console.log(" [x] Received task %s", task.content.toString());
        setTimeout(function () {
          console.log(" [x] Done");
        }, secs * 1000);
      },
      {
        noAck: true,
      }
    );
  });
});
