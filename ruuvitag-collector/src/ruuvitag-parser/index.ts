import { ruuviTagManufacturerId, validateRuuviTag } from '../ruuvitag-validator';
import DataFormat3ParsingStrategy from './data-format-3-parsing-strategy';
import { parseValueFromHexString, ValueOffset } from './parse-value-from-hex-string';

export interface RuuviTagSensorData {
    relativeHumidityPercentage: number;
    temperature: number;
    pressure: number;
    accelerationX: number;
    accelerationY: number;
    accelerationZ: number;
    batteryVoltage: number;
}

export interface RuuviTagParsingStrategy {
    parse: (rawRuuviTagData: Buffer) => RuuviTagSensorData;
}

export interface ValidRawRuuviTagData extends  Buffer {}

enum RuuvitagSensorProtocolDataFormat {
    DataFormat3 = 0x03,
    DataFormat2And4 = 0x04,
    DataFormat5 = 0x05,
}

const ManufacturerIdOffset: ValueOffset = [0, 4];
const DataFormatOffset: ValueOffset = [4, 6];

const DataFormatParsingStrategyMap = new Map<RuuvitagSensorProtocolDataFormat, RuuviTagParsingStrategy>([
    [RuuvitagSensorProtocolDataFormat.DataFormat3, DataFormat3ParsingStrategy],
]);

const validate = (rawRuuviTagData: Buffer) => {
    const rawRuuviTagString = rawRuuviTagData.toString('hex');
    const manufacturerId = parseValueFromHexString(rawRuuviTagString, ManufacturerIdOffset);

    if (!validateRuuviTag(rawRuuviTagData)) {
        throw Error(
            `Not a valid RuuviTag payload. Got manufacturerId: ${manufacturerId}, expected: ${ruuviTagManufacturerId}`,
        );
    }
};

const resolveParsingStrategy = (rawRuuviTagData: Buffer): RuuviTagParsingStrategy => {
    const rawRuuviTagString = rawRuuviTagData.toString('hex');
    const dataFormat = parseValueFromHexString(rawRuuviTagString, DataFormatOffset);
    const parsingStrategy = DataFormatParsingStrategyMap.get(dataFormat);

    if (!parsingStrategy) {
        throw Error(`Unsupported data format, got a payload containing data format: ${dataFormat}`);
    }

    return parsingStrategy;
};

const parse = (rawRuuviTagData: Buffer) => {
    validate(rawRuuviTagData);
    return resolveParsingStrategy(rawRuuviTagData).parse(rawRuuviTagData);
};

export default parse;
