import { parseValueFromHexString } from './parse-value-from-hex-string';

describe('parseValueFromHexString()', () => {
    it('should parse the value from the given hex string with the given character offset', () => {
        expect(parseValueFromHexString('990403', [4, 6])).toEqual(3);
        expect(parseValueFromHexString('990403', [0, 4])).toEqual(0x9904);
    });
});
