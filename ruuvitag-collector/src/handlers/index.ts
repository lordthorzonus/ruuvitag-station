import { flow } from 'lodash';
import { Peripheral } from 'noble';
import { RuuviTagScannerEventHandler } from '../ruuvitag-collector';
import parse from '../ruuvitag-parser';
import decorateRuuviTagSensorDataWithCalculatedValues from '../ruuvitag-sensor-data-decorator';
import { discoveredPeripheralLogger } from './discovered-peripheral-logger';
import { ruuviTagSensorDataInfluxDbPersister } from './influxDbDataPersister';
import { updatedRuuviSensorDataLogger } from './updated-data-logger';

const getManufacturerData = (peripheral: Peripheral): Buffer => peripheral.advertisement.manufacturerData;

const updatedHandler: RuuviTagScannerEventHandler = (peripheral: Peripheral) => {
    const getEnhancedRuuviTagData = flow(
        getManufacturerData,
        parse,
        decorateRuuviTagSensorDataWithCalculatedValues,
        updatedRuuviSensorDataLogger,
    );

    return ruuviTagSensorDataInfluxDbPersister(
        peripheral.address,
        getEnhancedRuuviTagData(peripheral),
    );
};

export default {
    discoveredHandler: discoveredPeripheralLogger,
    updatedHandler,
};
