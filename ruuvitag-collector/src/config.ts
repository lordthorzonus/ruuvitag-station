import { config } from 'dotenv';

config();

interface CollectorConfig {
    collectorId: string;
    rabbitMQHostname: string;
    rabbitMQProtocol: string;
    rabbitMQPort: number;
    rabbitMQUsername: string;
    rabbitMQPassword: string;
    enableCollectorLogging: boolean;
}

const collectorConfig: CollectorConfig = {
    collectorId: process.env.RUUVITAG_COLLECTOR_ID || 'ruuvitag-default-collector',
    rabbitMQHostname: process.env.RABBITMQ_HOSTNAME || 'localhost',
    rabbitMQProtocol: process.env.RABBITMQ_PROTOCOL || 'amqp',
    rabbitMQPort: process.env.RABBITMQ_PROTOCOL ? +process.env.RABBITMQ_PROTOCOL : 5672,
    rabbitMQUsername: process.env.RABBITMQ_USERNAME || 'guest',
    rabbitMQPassword: process.env.RABBITMQ_PASSWORD || 'guest',
    enableCollectorLogging: Boolean(process.env.ENABLE_RUUVITAG_COLLECTOR_LOGGING) || false,
};

export default collectorConfig;
