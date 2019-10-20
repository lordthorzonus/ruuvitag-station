import { FieldType, InfluxDB } from 'influx';
import config from './config';

export const ruuviTagSensorDataMeasurementName = 'ruuvitag_sensor_data';

const influxDB = new InfluxDB({
        database: config.influxDB.database,
        port: config.influxDB.port,
        host: config.influxDB.hostname,
        username: config.influxDB.username,
        password: config.influxDB.password,
        schema: [
            {
                measurement: ruuviTagSensorDataMeasurementName,
                fields: {
                    humidex: FieldType.FLOAT,
                    heat_index: FieldType.FLOAT,
                    dew_point: FieldType.FLOAT,
                    absolute_humidity: FieldType.FLOAT,
                    acceleration_magnitude: FieldType.FLOAT,
                    relative_humidity_percentage: FieldType.FLOAT,
                    temperature: FieldType.FLOAT,
                    pressure: FieldType.INTEGER,
                    acceleration_x: FieldType.FLOAT,
                    acceleration_y: FieldType.FLOAT,
                    acceleration_z: FieldType.FLOAT,
                    battery_voltage: FieldType.FLOAT,
                },
                tags: [
                    'ruuvitag_id',
                ],
            },
        ],
    })
;

export default influxDB;
