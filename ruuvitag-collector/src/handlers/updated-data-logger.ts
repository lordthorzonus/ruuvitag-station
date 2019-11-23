import { RuuviTagMeasurement } from '../ruuvi-tag-measurement-transformer';

export const updatedRuuviTagMeasurementLogger = (ruuviTagMeasurement: RuuviTagMeasurement) => {
    console.log('Measurement: ', ruuviTagMeasurement);
    return ruuviTagMeasurement;
};
