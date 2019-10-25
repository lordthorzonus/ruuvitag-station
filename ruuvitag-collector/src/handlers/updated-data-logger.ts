import { RuuviTagMeasurement } from '../transform-peripheral-advertisement-to-ruuvi-tag-measurement';

export const updatedRuuviTagMeasurementLogger = (ruuviTagMeasurement: RuuviTagMeasurement) => {
    console.log('Measurement: ', ruuviTagMeasurement);
    return ruuviTagMeasurement;
};
