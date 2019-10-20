import { EnhancedRuuviTagSensorData } from '../ruuvitag-sensor-data-decorator';

export const updatedRuuviSensorDataLogger = (enhancedRuuviTagSensorData: EnhancedRuuviTagSensorData) => {
    console.log('Got data :', enhancedRuuviTagSensorData);
};
