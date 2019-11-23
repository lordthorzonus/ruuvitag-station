import { RuuviTagMeasurement } from '../ruuvitag-measurement-transformer';

export const updatedRuuviTagMeasurementLogger = (ruuviTagMeasurement: RuuviTagMeasurement) => {
    console.log('Measurement: ', ruuviTagMeasurement);
    return ruuviTagMeasurement;
};
