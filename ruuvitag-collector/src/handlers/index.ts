import { Peripheral } from 'noble';
import { RuuviTagScannerEventHandler } from '../ruuvitag-collector';
import { transformPeripheralAdvertisementToRuuviTagMeasurement } from '../transform-peripheral-advertisement-to-ruuvi-tag-measurement';
import { discoveredPeripheralLogger } from './discovered-peripheral-logger';
import { updatedRuuviTagMeasurementLogger } from './updated-data-logger';

const updatedHandler: RuuviTagScannerEventHandler = (peripheral: Peripheral) => {
    return updatedRuuviTagMeasurementLogger(transformPeripheralAdvertisementToRuuviTagMeasurement(peripheral));
};

export default {
    discoveredHandler: discoveredPeripheralLogger,
    updatedHandler,
};
