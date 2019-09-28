export type ValueOffset = [number, number];

export const parseValueFromHexString = (rawDataString: string, dataOffset: ValueOffset): number => {
    const hexadecimalRadix = 16;
    return parseInt(rawDataString.substring(dataOffset[0], dataOffset[1]), hexadecimalRadix);
};
