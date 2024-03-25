//https://kafka.apache.org/quickstart

// Get the docker image
// $ docker pull apache/kafka:3.7.0

// Start the kafka docker container
// $ docker run -p 9092:9092 apache/kafka:3.7.0


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
const consumer_one = kafka.consumer({ groupId: "group_one" });
const consumer_two = kafka.consumer({ groupId: "group_two" });

async function run() {
  // Connect the producer and consumers
  await producer.connect();
  await consumer_one.connect();
  await consumer_two.connect();

  // Subscribe consumers to the topic
  await consumer_one.subscribe({ topic: "my-topic", fromBeginning: true });
  await consumer_two.subscribe({ topic: "my-topic", fromBeginning: true });

  // Start consuming messages
  await consumer_one.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
        groupId: "group_one",
      });
    },
  });

  await consumer_two.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
        groupId: "group_two",
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
