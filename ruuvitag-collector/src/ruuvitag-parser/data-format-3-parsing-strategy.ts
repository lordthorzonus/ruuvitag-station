import { RuuviTagParsingStrategy } from './index';
import { parseValueFromHexString, ValueOffset } from './parse-value-from-hex-string';

const HumidityOffset: ValueOffset = [6, 8];
const TemperatureBaseOffset: ValueOffset = [8, 10];
const TemperatureFractionOffset: ValueOffset = [10, 12];
const PressureOffset: ValueOffset = [12, 16];
const AccelerationXOffset: ValueOffset = [16, 20];
const AccelerationYOffset: ValueOffset = [20, 24];
const AccelerationZOffset: ValueOffset = [24, 28];
const BatteryOffset: ValueOffset = [28, 32];

/**
 * Parses the acceleration data from the payload.
 * Values are 2-complement 16 bit signed integers. All channels are identical.
 *
 * Returns values in G.
 */
const parseAcceleration = (rawDataString: string, dataOffset: ValueOffset): number => {
    const twosComplement = (value: number): number => {
        const isValueNegative = (value & 0x8000) > 0;
        const max16IntValue = 0x10000;

        return isValueNegative ? (value - max16IntValue) : value;
    };

    const acceleration = twosComplement(parseValueFromHexString(rawDataString, dataOffset));
    return acceleration / 1000;
};

/**
 * Parses the temperature from the payload.
 * Temperature is divided in base temperature which is a signed byte and fractions.
 *
 * Returns the value in Celsius (C).
 */
const parseTemperature = (rawDataString: string): number => {
    const temperatureByte = parseValueFromHexString(rawDataString, TemperatureBaseOffset);

    // First bit is the sign bit which tells if the temperature is negative.
    const temperatureBase = temperatureByte & 0x7F;
    const isTemperatureNegative = ((temperatureByte >> 7) & 1) === 1;
    const temperatureFraction = parseValueFromHexString(rawDataString, TemperatureFractionOffset) / 100;

    const temperature = temperatureBase + temperatureFraction;

    return isTemperatureNegative ? temperature * -1 : temperature;
};

/**
 * Parses the humidity from the payload.
 * One lsb is 0.5%, e.g. 128 is 64%. Values above 200 (100%) indicate a fault in sensor.
 *
 * Returns the value in percents (%)
 */
const parseRelativeHumidity = (rawDataString: string): number => {
    return parseValueFromHexString(rawDataString, HumidityOffset) * 0.5;
};

/**
 * Parses the battery voltage from the payload.
 *
 * Returns the value in Volts (V).
 */
const parseBatteryVoltage = (rawDataString: string): number => {
    return parseValueFromHexString(rawDataString, BatteryOffset) / 1000;
};

/**
 * Parses the Atmospheric pressure from the payload.
 * Values supported by the RuuviTag are 50000 Pa to 115536 Pa in 1 Pa increments.
 *
 * Example:
 * Value	Measurement
 * 00000	50000 Pa
 * 51325	101325 Pa (average sea-level pressure)
 * 65536	115536 Pa
 *
 * Returns the pressure in Pascals (Pa).
 */
const parsePressure = (rawDataString: string): number => {
    const minimumSupportedPascalMeasurement = 50000;
    return parseValueFromHexString(rawDataString, PressureOffset) + minimumSupportedPascalMeasurement;
};

/**
 * Parses the raw manufacturer specific data field according to the Data Format 3 Specification (RAWv1)
 * @see https://github.com/ruuvi/ruuvi-sensor-protocols/blob/master/dataformat_03.md
 */
const DataFormat3ParsingStrategy: RuuviTagParsingStrategy = {
    parse(rawRuuviTagData) {
        const rawRuuviTagDataString = rawRuuviTagData.toString('hex');

        return {
            accelerationX: parseAcceleration(rawRuuviTagDataString, AccelerationXOffset),
            accelerationY: parseAcceleration(rawRuuviTagDataString, AccelerationYOffset),
            accelerationZ: parseAcceleration(rawRuuviTagDataString, AccelerationZOffset),
            batteryVoltage: parseBatteryVoltage(rawRuuviTagDataString),
            relativeHumidityPercentage: parseRelativeHumidity(rawRuuviTagDataString),
            pressure: parsePressure(rawRuuviTagDataString),
            temperature: parseTemperature(rawRuuviTagDataString),
        };
    },
};

export default DataFormat3ParsingStrategy;
