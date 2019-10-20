import { RuuviTagSensorData } from '../ruuvitag-parser';
import { calculateAbsoluteHumidity } from './calculators/absolute-humidity-calculator';
import { calculateAccelerationVectorLength } from './calculators/acceleration-vector-calculator';
import { calculateDewPoint } from './calculators/dew-point-calculator';
import { calculateHeatIndex } from './calculators/heat-index-calculator';
import { calculateHumidex } from './calculators/humidex-calculator';

export interface EnhancedRuuviTagSensorData extends RuuviTagSensorData {
    time: Date;
    humidex: number;
    heatIndex: number;
    dewPoint: number;
    absoluteHumidity: number;
    accelerationMagnitude: number;
}

const decorateRuuviTagSensorDataWithCalculatedValues = (
    ruuviTagSensorData: RuuviTagSensorData,
): EnhancedRuuviTagSensorData => {
    const dewPoint = calculateDewPoint(ruuviTagSensorData.temperature, ruuviTagSensorData.relativeHumidityPercentage);
    return {
        ...ruuviTagSensorData,
        time: new Date(),
        humidex: calculateHumidex(ruuviTagSensorData.temperature, dewPoint),
        heatIndex: calculateHeatIndex(ruuviTagSensorData.temperature, ruuviTagSensorData.relativeHumidityPercentage),
        dewPoint,
        accelerationMagnitude: calculateAccelerationVectorLength(
            ruuviTagSensorData.accelerationX,
            ruuviTagSensorData.accelerationY,
            ruuviTagSensorData.accelerationZ,
        ),
        absoluteHumidity: calculateAbsoluteHumidity(
            ruuviTagSensorData.temperature, ruuviTagSensorData.relativeHumidityPercentage,
        ),
    };
};

export default decorateRuuviTagSensorDataWithCalculatedValues;
