import { flow } from 'lodash';
import { publishDiscoveredRuuviTag, publishRuuviTagMeasurement } from '../amqp/amqp-client';
import config from '../config';
import { RuuviTagScannerEventHandler } from '../ruuvitag-collector';
import {
    RuuviTagMeasurement,
    transformPeripheralAdvertisementToRuuviTagMeasurement,
} from '../ruuvitag-measurement-transformer';
import { discoveredPeripheralLogger } from './discovered-peripheral-logger';
import { updatedRuuviTagMeasurementLogger } from './updated-data-logger';

const nothingHandler = (ruuvitagMeasurement: RuuviTagMeasurement) => ruuvitagMeasurement;

const updatedHandler: RuuviTagScannerEventHandler = flow(
    transformPeripheralAdvertisementToRuuviTagMeasurement,
    config.enableCollectorLogging ? updatedRuuviTagMeasurementLogger : nothingHandler,
    async (ruuvitagMeasurement) => { await publishRuuviTagMeasurement(ruuvitagMeasurement); return; },
);

const discoveredHandler = flow(
    transformPeripheralAdvertisementToRuuviTagMeasurement,
    config.enableCollectorLogging ? discoveredPeripheralLogger : nothingHandler,
    async (ruuvitagMeasurement) => { await publishDiscoveredRuuviTag(ruuvitagMeasurement.peripheral); return; },
);

export default {
    discoveredHandler,
    updatedHandler,
};
