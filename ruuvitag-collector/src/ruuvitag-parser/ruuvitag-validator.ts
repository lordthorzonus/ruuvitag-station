import { parse16BitInteger, ValueOffset } from './byte-utils';

/**
 * RuuviTag manufacturer id is 0x0499
 */
export const ruuviTagManufacturerIdLeastSignificantByteFirst = 0x9904;
const ManufacturerIdOffset: ValueOffset = [0, 1];

/**
 * Checks if the given manufacturerData contains the correct manufacturerId 0x0499 The least significant byte first.
 */
export const validateRuuviTag = (manufacturerData?: Buffer): boolean => {
    if (!manufacturerData) {
        return false;
    }

    const manufacturerId = parse16BitInteger(manufacturerData, ManufacturerIdOffset);

    return manufacturerId === ruuviTagManufacturerIdLeastSignificantByteFirst;
};
