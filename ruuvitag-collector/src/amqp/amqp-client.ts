import { connect } from 'amqplib';
import * as uuid from 'uuid/v4';
import config from '../config';
import { RuuviTag, RuuviTagMeasurement } from '../ruuvitag-measurement-transformer';

const RUUVITAG_EXCHANGE = 'ruuvitag';
enum RuuviTagRoutingKeys {
    RuuviTagDiscovered = 'ruuvitag.discovered',
    RuuviTagNewMeasurement = 'ruuvitag.measurement',
}

export const amqpConnection = connect(
    {
        hostname: config.rabbitMQHostname,
        port: config.rabbitMQPort,
        protocol: config.rabbitMQProtocol,
        username: config.rabbitMQUsername,
        password: config.rabbitMQPassword,
    },
);

export const ruuviTagExchange = amqpConnection.then(
    connection => connection.createChannel().then(
        channel => channel.assertExchange(RUUVITAG_EXCHANGE, 'topic').then(() => channel),
    ),
);
const publishMessage = async <T extends object>(routingKey: RuuviTagRoutingKeys, messageBody: T) => {
    const exchange = await ruuviTagExchange;
    const messageId = uuid();
    return exchange.publish(RUUVITAG_EXCHANGE, routingKey, Buffer.from(JSON.stringify(messageBody)), {
        appId: 'ruuvitag-collector',
        messageId,
        correlationId: messageId,
        type: routingKey,
        contentType: 'application/json',
        headers: {
            'ruuvitag-collector-id': config.collectorId,
        },
    });
};

export const publishRuuviTagMeasurement = async (ruuviTagMeasurement: RuuviTagMeasurement) => {
    return await publishMessage(RuuviTagRoutingKeys.RuuviTagNewMeasurement, ruuviTagMeasurement);
};

export const publishDiscoveredRuuviTag = async (ruuviTag: RuuviTag) => {
    return await publishMessage(RuuviTagRoutingKeys.RuuviTagDiscovered, ruuviTag);
};

export const closeConnection = async () => {
    const connection = await amqpConnection;
    await connection.close();

    return;
};
