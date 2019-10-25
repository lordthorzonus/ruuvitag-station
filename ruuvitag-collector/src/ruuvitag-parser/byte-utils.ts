export type ValueOffset = [number, number];

export const parse16BitInteger = (rawData: Buffer, byteOffset: ValueOffset): number => {
    return (rawData[byteOffset[0]] << 8 | rawData[byteOffset[1] & 0xFF]);
};

export const parse8BitInteger = (rawData: Buffer, byteOffset: ValueOffset): number => {
    return rawData[byteOffset[0]] & 0xFF;
};

export const twosComplement = (value: number): number => {
    const isValueNegative = (value & 0x8000) > 0;
    const max16IntValue = 0x10000;

    return isValueNegative ? (value - max16IntValue) : value;
};
