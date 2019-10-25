import { Peripheral } from 'noble';
import RuuviTagScanner, { RuuviTagScannerEvents } from './ruuvitag-scanner';

export type RuuviTagScannerEventHandler = (peripheral: Peripheral) => void;

export const run = (discoverHandler: RuuviTagScannerEventHandler, updatedHandler: RuuviTagScannerEventHandler) => {
    const ruuviTagScanner = new RuuviTagScanner();

    ruuviTagScanner.on(RuuviTagScannerEvents.DiscoveredRuuviTag, discoverHandler);
    ruuviTagScanner.on(RuuviTagScannerEvents.RuuviTagUpdated, updatedHandler);

    ruuviTagScanner.startScanning();
};
