import { RuuviTagSensorData } from '../ruuvitag-parser';
import { calculateAbsoluteHumidity } from './calculators/absolute-humidity-calculator';
import { calculateDewPoint } from './calculators/dew-point-calculator';
import { calculateHeatIndex } from './calculators/heat-index-calculator';
import { calculateHumidex } from './calculators/humidex-calculator';

export interface EnhancedRuuviTagSensorData extends RuuviTagSensorData {
    humidex: number | null;
    heatIndex: number | null;
    dewPoint: number | null;
    absoluteHumidity: number | null;
}

const decorateRuuviTagSensorDataWithCalculatedValues = (
    ruuviTagSensorData: RuuviTagSensorData,
): EnhancedRuuviTagSensorData => {
    const dewPoint = calculateDewPoint(ruuviTagSensorData.temperature, ruuviTagSensorData.relativeHumidityPercentage);
    return {
        ...ruuviTagSensorData,
        humidex: calculateHumidex(ruuviTagSensorData.temperature, dewPoint),
        heatIndex: calculateHeatIndex(ruuviTagSensorData.temperature, ruuviTagSensorData.relativeHumidityPercentage),
        dewPoint,
        absoluteHumidity: calculateAbsoluteHumidity(
            ruuviTagSensorData.temperature, ruuviTagSensorData.relativeHumidityPercentage,
        ),
    };
};

export default decorateRuuviTagSensorDataWithCalculatedValues;
