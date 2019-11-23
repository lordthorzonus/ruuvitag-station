import { RuuviTagMeasurement } from '../ruuvitag-measurement-transformer';

export const discoveredPeripheralLogger = (ruuviTagMeasurement: RuuviTagMeasurement) => {
    console.log('Discovered RuuviTag: ', ruuviTagMeasurement.peripheral);
    return ruuviTagMeasurement;
};
