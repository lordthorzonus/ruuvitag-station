import { parseValueFromHexString, ValueOffset } from './ruuvitag-parser/parse-value-from-hex-string';

export const ruuviTagManufacturerId = 0x0499;
const ManufacturerIdOffset: ValueOffset = [0, 4];

/**
 * Checks if the given manufacturerData contains the correct manufacturerId 0x9904.
 */
export const validateRuuviTag = (manufacturerData?: Buffer): boolean => {
    if (!manufacturerData) {
        return false;
    }

    const rawRuuviTagString = manufacturerData.toString('hex');
    const manufacturerId = parseValueFromHexString(rawRuuviTagString, ManufacturerIdOffset);

    return manufacturerId === parseInt('9904', 16);
};
