import { parse16BitInteger, parse8BitInteger, ValueOffset } from './byte-utils';
import { ruuviTagManufacturerIdLeastSignificantByteFirst, validateRuuviTag } from './ruuvitag-validator';
import DataFormat3ParsingStrategy from './parsing-strategies/data-format-3-parsing-strategy';
import DataFormat5ParsingStrategy from './parsing-strategies/data-format-5-parsing-strategy';

type Nullable<T> = T | null;

export interface RuuviTagSensorData {
    relativeHumidityPercentage: Nullable<number>;
    temperature: Nullable<number>;
    pressure: Nullable<number>;
    accelerationX: Nullable<number>;
    accelerationY: Nullable<number>;
    accelerationZ: Nullable<number>;
    batteryVoltage: Nullable<number>;
    txPower: Nullable<number>;
    movementCounter: Nullable<number>;
    measurementSequence: Nullable<number>;
    macAddress: Nullable<string>;
}

export interface RuuviTagParsingStrategy {
    parse: (rawRuuviTagData: Buffer) => RuuviTagSensorData;
}

enum RuuvitagSensorProtocolDataFormat {
    DataFormat3 = 0x03,
    DataFormat2And4 = 0x04,
    DataFormat5 = 0x05,
}

const ManufacturerIdOffset: ValueOffset = [0, 1];
const DataFormatOffset: ValueOffset = [2, 2];

const DataFormatParsingStrategyMap = new Map<RuuvitagSensorProtocolDataFormat, RuuviTagParsingStrategy>([
    [RuuvitagSensorProtocolDataFormat.DataFormat3, DataFormat3ParsingStrategy],
    [RuuvitagSensorProtocolDataFormat.DataFormat5, DataFormat5ParsingStrategy],
]);

const throwNotValidManufacturerIdError = (manufacturerId: number) => {
    throw Error(
        `Not a valid RuuviTag payload. Got manufacturerId: 0x${
            manufacturerId.toString(16)
        }, expected: 0x${
            ruuviTagManufacturerIdLeastSignificantByteFirst.toString(16)
        }`,
    );
};

const validate = (rawRuuviTagData: Buffer) => {
    const manufacturerId = parse16BitInteger(rawRuuviTagData, ManufacturerIdOffset);

    if (!validateRuuviTag(rawRuuviTagData)) {
        throwNotValidManufacturerIdError(manufacturerId);
    }
};

const resolveParsingStrategy = (rawRuuviTagData: Buffer): RuuviTagParsingStrategy => {
    const dataFormat = parse8BitInteger(rawRuuviTagData, DataFormatOffset);
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
