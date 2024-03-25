//docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management

var amqp = require("amqplib/callback_api");
//create new queue
var queue = "newTask";

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  //create a new chanel
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    channel.assertQueue(queue, {
      durable: true,
    });
    //push tasks to queue
    var task = "Hello Rabbit!";
    channel.sendToQueue(queue, Buffer.from(task), {
      persistent: true,
    });
    console.log(" [x] task pushed to queue '%s'", task);
  });
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
