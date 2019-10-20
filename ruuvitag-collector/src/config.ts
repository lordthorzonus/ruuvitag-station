import { config } from 'dotenv';

config();

interface CollectorConfig {
    influxDB: {
        username: string;
        password: string;
        hostname: string;
        port: number;
        database: string;
    };
}

const collectorConfig: CollectorConfig = {
    influxDB: {
        username: process.env.INFLUX_DB_USERNAME || '',
        password: process.env.INFLUX_DB_PASSWORD || '',
        hostname: process.env.INFLUX_DB_HOSTNAME || 'localhost',
        port: process.env.INFLUX_DB_PORT ? +process.env.INFLUX_DB_PORT : 8086,
        database: process.env.INFLUX_DB_DATABASE_NAME || 'ruuvitag',
    },
};

export default collectorConfig;
