import { EventEmitter } from 'events';
const mockedNobleEventEmitter = new EventEmitter();
const mockedNobleEventListener = jest.fn().mockImplementation((eventName, callback) => {
    mockedNobleEventEmitter.on(eventName, callback);
});
const mockedNobleScanner = jest.fn();
jest.mock('@abandonware/noble', () => (
    { on: mockedNobleEventListener, startScanning: mockedNobleScanner }
));

import RuuviTagScanner, { RuuviTagScannerEvents } from './ruuvitag-scanner';

describe('RuuviTagScanner', () => {
    const peripheral = {
        advertisement: {
            manufacturerData: Buffer.from('99040512FC5394C37C0004FFFC040CAC364200CDCBB8334C884F', 'hex'),
        },
        address: 'a1:b2',
        rssi: 23,
        id: 'id',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register listeners to noble events when startScanning() is called', () => {
        const scanner = new RuuviTagScanner();
        scanner.startScanning();

        expect(mockedNobleEventListener).toHaveBeenCalledWith('discover', jasmine.any(Function));
        expect(mockedNobleEventListener).toHaveBeenCalledWith('stateChange', jasmine.any(Function));
    });

    it('should call nobles start scanning when noble emits that it is ready to scan', () => {
        const scanner = new RuuviTagScanner();
        scanner.startScanning();

        mockedNobleEventEmitter.emit('stateChange', 'poweredOn');
        expect(mockedNobleScanner).toHaveBeenCalledWith([], true);
    });

    it('should emit an DISCOVERED_RUUVI_TAG event when a ruuvitag is discovered', () => {
        const scanner = new RuuviTagScanner();
        const callbackAssertor = jest.fn();

        scanner.on(RuuviTagScannerEvents.DiscoveredRuuviTag, callbackAssertor);
        scanner.startScanning();
        mockedNobleEventEmitter.emit('discover', peripheral);
        mockedNobleEventEmitter.emit('discover', peripheral);

        expect(callbackAssertor).toHaveBeenCalledWith(peripheral);
        expect(callbackAssertor).toHaveBeenCalledTimes(1);
    });

    it('should emit an RUUVITAG_UPDATED event when a registered ruuvitag data is received ', () => {
        const scanner = new RuuviTagScanner();
        const callbackAssertor = jest.fn();

        scanner.on(RuuviTagScannerEvents.RuuviTagUpdated, callbackAssertor);
        scanner.startScanning();
        mockedNobleEventEmitter.emit('discover', peripheral);
        mockedNobleEventEmitter.emit('discover', peripheral);

        expect(callbackAssertor).toHaveBeenCalledWith(peripheral);
        expect(callbackAssertor).toHaveBeenCalledTimes(1);
    });

    it('should not emit events for a BLE device that is not a valid ruuvitag device.', () => {
        const invalidPeripheral = {
            advertisement: {
                manufacturerData: Buffer.from('11110512FC5394C37C0004FFFC040CAC364200CDCBB8334C884F', 'hex'),
            },
            address: 'a1:b2',
            rssi: 23,
            id: 'id',
        };

        const scanner = new RuuviTagScanner();
        const discoverCallbackAssertor = jest.fn();
        const updatedCallbackAssertor = jest.fn();

        scanner.on(RuuviTagScannerEvents.DiscoveredRuuviTag, discoverCallbackAssertor);
        scanner.on(RuuviTagScannerEvents.RuuviTagUpdated, updatedCallbackAssertor);
        scanner.startScanning();

        mockedNobleEventEmitter.emit('discover', invalidPeripheral);
        mockedNobleEventEmitter.emit('discover', invalidPeripheral);

        expect(discoverCallbackAssertor).toHaveBeenCalledTimes(0);
        expect(updatedCallbackAssertor).toHaveBeenCalledTimes(0);
    });
});
