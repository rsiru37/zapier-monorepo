import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "zapier",
    brokers: ["kafka:9092"]
})
//console.log("URL", process.env.KAFKA_URL);

export { kafka };