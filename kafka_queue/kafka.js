
//single producer with multiple consumer

const express = require("express");
const { Kafka } = require("kafkajs");

const app = express();
const port = 3000;

// Initialize Kafka client
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});
// Create Kafka producer
const producer = kafka.producer();

// Create Kafka consumer instances for different consumer groups
const consumer1 = kafka.consumer({ groupId: "group1" });
const consumer2 = kafka.consumer({ groupId: "group2" });

async function run() {
  // Connect the producer and consumers
  await producer.connect();
  await consumer1.connect();
  await consumer2.connect();

  // Subscribe consumers to the topic
  await consumer1.subscribe({ topic: "my-topic", fromBeginning: true });
  await consumer2.subscribe({ topic: "my-topic", fromBeginning: true });

  // Start consuming messages
  await consumer1.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
        groupId: "group1",
      });
    },
  });

  await consumer2.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
        groupId: "group2",
      });
    },
  });
}

run().catch(console.error);

// Define a route to send messages
app.get("/send-message", async (req, res) => {
  try {
    await producer.send({
      topic: "my-topic",
      messages: [{ value: "Hello Kafka!" }],
    });
    res.send("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Error sending message");
  }
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});




//https://kafka.apache.org/quickstart

//bin/zookeeper-server-start.sh config/zookeeper.properties
//bin/kafka-server-start.sh config/server.properties

