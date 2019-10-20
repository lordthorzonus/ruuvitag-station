import { RuuviTagScannerEventHandler } from '../ruuvitag-collector';

export const discoveredPeripheralLogger: RuuviTagScannerEventHandler = peripheral => {
    console.log('Discovered RuuviTag with id: ', peripheral.id);
};
