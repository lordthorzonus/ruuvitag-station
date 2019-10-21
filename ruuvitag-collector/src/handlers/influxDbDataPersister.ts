import influxDB, { ruuviTagSensorDataMeasurementName } from '../infliux-db';
import { EnhancedRuuviTagSensorData } from '../ruuvitag-sensor-data-decorator';

export const ruuviTagSensorDataInfluxDbPersister = (
    tagId: string,
    enhancedRuuviTagSensorData: EnhancedRuuviTagSensorData,
) => {
    influxDB.writePoints([
            {
                measurement: ruuviTagSensorDataMeasurementName,
                fields: {
                    humidex: enhancedRuuviTagSensorData.humidex,
                    heat_index: enhancedRuuviTagSensorData.heatIndex,
                    dew_point: enhancedRuuviTagSensorData.dewPoint,
                    absolute_humidity: enhancedRuuviTagSensorData.absoluteHumidity,
                    acceleration_magnitude: enhancedRuuviTagSensorData.accelerationMagnitude,
                    relative_humidity_percentage: enhancedRuuviTagSensorData.relativeHumidityPercentage,
                    temperature: enhancedRuuviTagSensorData.temperature,
                    pressure: enhancedRuuviTagSensorData.pressure,
                    acceleration_x: enhancedRuuviTagSensorData.accelerationX,
                    acceleration_y: enhancedRuuviTagSensorData.accelerationY,
                    acceleration_z: enhancedRuuviTagSensorData.accelerationZ,
                    battery_voltage: enhancedRuuviTagSensorData.batteryVoltage,
                },
                timestamp: enhancedRuuviTagSensorData.time,
                tags: {
                    ruuvitag_id: tagId,
                },
            },
        ],
    );
};
