import { EventEmitter } from 'events';
import * as noble from 'noble';
import { Peripheral } from 'noble';
import { validateRuuviTag } from './ruuvitag-validator';

export enum RuuviTagScannerEvents {
    DiscoveredRuuviTag = 'DISCOVERED_RUUVITAG',
    RuuviTagUpdated = 'UPDATED_RUUVITAG',
}

class RuuviTagScanner extends EventEmitter {

    private static isPeripheralRuuviTag(peripheral: Peripheral): boolean {
        return validateRuuviTag(peripheral.advertisement.manufacturerData);
    }

    private ruuviTags = new Map<string, Peripheral>();

    constructor() {
        super();
        console.log('Started scanning');
    }

    public on(event: RuuviTagScannerEvents, listener: (peripheral: Peripheral) => void): this {
        return super.on(event, listener);
    }

    public startScanning() {
        noble.on('discover', peripheral => this.onDiscover(peripheral));
        noble.on('stateChange', state => {
            console.log('Noble state: ', state);
            if (state === 'poweredOn') {
                noble.startScanning([], true);
            }
        });
    }

    private registerNewRuuviTag(peripheral: Peripheral): void {
        this.ruuviTags.set(peripheral.id, peripheral);
    }

    private isRuuviTagRegistered(peripheral: Peripheral): boolean {
        return this.ruuviTags.get(peripheral.id) !== undefined;
    }

    private handleDiscoveredRuuviTag(peripheral: Peripheral): void {
        if (this.isRuuviTagRegistered(peripheral)) {
            this.emit(RuuviTagScannerEvents.RuuviTagUpdated, peripheral);

            return;
        }

        this.registerNewRuuviTag(peripheral);
        this.emit(RuuviTagScannerEvents.DiscoveredRuuviTag, peripheral);
    }

    private onDiscover(peripheral: Peripheral): void {
        if (RuuviTagScanner.isPeripheralRuuviTag(peripheral)) {
            this.handleDiscoveredRuuviTag(peripheral);
        }
    }
}

export default RuuviTagScanner;
