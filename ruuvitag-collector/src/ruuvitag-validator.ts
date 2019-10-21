import { parseValueFromHexString, ValueOffset } from './ruuvitag-parser/parse-value-from-hex-string';

/**
 * RuuviTag manufacturer id is 0x0499
 */
export const ruuviTagManufacturerIdLeastSignificantByteFirst = 0x9904;
const ManufacturerIdOffset: ValueOffset = [0, 4];

/**
 * Checks if the given manufacturerData contains the correct manufacturerId 0x0499 The least significant byte first.
 */
export const validateRuuviTag = (manufacturerData?: Buffer): boolean => {
    if (!manufacturerData) {
        return false;
    }

    const rawRuuviTagString = manufacturerData.toString('hex');
    const manufacturerId = parseValueFromHexString(rawRuuviTagString, ManufacturerIdOffset);

    return manufacturerId === ruuviTagManufacturerIdLeastSignificantByteFirst;
};
