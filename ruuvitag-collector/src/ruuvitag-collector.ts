import { Peripheral } from 'noble';
import { closeConnection } from './amqp/amqp-client';
import RuuviTagScanner, { RuuviTagScannerEvents } from './ruuvitag-scanner';

export type RuuviTagScannerEventHandler = (peripheral: Peripheral) => Promise<void>;

export const run = (discoverHandler: RuuviTagScannerEventHandler, updatedHandler: RuuviTagScannerEventHandler) => {
    const ruuviTagScanner = new RuuviTagScanner();

    ruuviTagScanner.on(RuuviTagScannerEvents.DiscoveredRuuviTag, discoverHandler);
    ruuviTagScanner.on(RuuviTagScannerEvents.RuuviTagUpdated, updatedHandler);

    ruuviTagScanner.startScanning();
    console.log('Started the collector');
};

export const shutdown = async () => {
    console.log('Shutting down the collector');
    await closeConnection();

    process.exit(0);
};
