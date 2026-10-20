import { Kafka, logLevel } from "kafkajs";


const brokers = (
    process.env.KAFKA_BROKERS ||
    "localhost:29093"
).split(",");


const kafka = new Kafka({

    clientId:
        process.env.KAFKA_CLIENT_ID ||
        "lokresolve-service",

    brokers,

    logLevel: logLevel.INFO

});


export default kafka;