jest.mock('noble');

import RuuviTagScanner from './ruuvitag-scanner';

describe('RuuviTagScanner', () => {
    it('should emit an RUUVITAG_DISCOVERED event when a ruuvitag is discovered', () => {

    });

    it('should emit an RUUVITAG_UPDATED event when a registered ruuvitag data is received ', () => {

    });

    it('should not emit events for a BLE device that is not a valid ruuvitag device.', () => {

    });
});
