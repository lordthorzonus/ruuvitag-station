import DataFormat3ParsingStartegy from './data-format-3-parsing-strategy';
import { RuuviTagSensorData } from './index';

describe('Data Format 3 Parsing Strategy', () => {
    const testCases: Array<[string, RuuviTagSensorData]> = [
        [
            '990403291A1ECE1EFC18F94202CA0B53',
            {
                temperature: 26.3,
                pressure: 102766,
                relativeHumidityPercentage: 20.5,
                accelerationX: -1.000,
                accelerationY: -1.726,
                accelerationZ: 0.714,
                batteryVoltage: 2.899,
            },
        ],
        [
            '990403FF7F63FFFF7FFF7FFF7FFFFFFF',
            {
                temperature: 127.99,
                pressure: 115535,
                relativeHumidityPercentage: 127.5,
                accelerationX: 32.767,
                accelerationY: 32.767,
                accelerationZ: 32.767,
                batteryVoltage: 65.535,
            },
        ],
        [
            '99040300FF6300008001800180010000',
            {
                temperature: -127.99,
                pressure: 50000,
                relativeHumidityPercentage: 0.0,
                accelerationX: -32.767,
                accelerationY: -32.767,
                accelerationZ: -32.767,
                batteryVoltage: 0.000,
            },
        ],
    ];

    it.each(testCases)(
        'should parse the raw data %s to a valid RuuviTagSensorData',
        (rawStringData, expectedRuuviTagSensorData) => {
            const rawData = Buffer.from(rawStringData, 'hex');
            expect(DataFormat3ParsingStartegy.parse(rawData)).toEqual(expectedRuuviTagSensorData);
        },
    );
});
