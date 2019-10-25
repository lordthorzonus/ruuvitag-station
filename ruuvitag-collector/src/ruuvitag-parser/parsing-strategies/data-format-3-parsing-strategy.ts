import { parse16BitInteger, parse8BitInteger, twosComplement, ValueOffset } from '../byte-utils';
import { RuuviTagParsingStrategy} from '../index';

const HumidityOffset: ValueOffset = [3, 3];
const TemperatureBaseOffset: ValueOffset = [4, 4];
const TemperatureFractionOffset: ValueOffset = [5, 5];
const PressureOffset: ValueOffset = [6, 7];
const AccelerationXOffset: ValueOffset = [8, 9];
const AccelerationYOffset: ValueOffset = [10, 11];
const AccelerationZOffset: ValueOffset = [12, 13];
const BatteryOffset: ValueOffset = [14, 15];

/**
 * Parses the acceleration data from the advertisement.
 * Values are 2-complement 16 bit signed integers. All channels are identical.
 *
 * @return Returns values in G.
 */
const parseAcceleration = (rawData: Buffer, dataOffset: ValueOffset): number => {
    const acceleration = twosComplement(parse16BitInteger(rawData, dataOffset));
    return acceleration / 1000;
};

/**
 * Parses the temperature from the advertisement.
 * Temperature is divided in base temperature which is a signed byte and fractions.
 *
 * @return Returns the value in Celsius (C).
 */
const parseTemperature = (rawData: Buffer): number => {
    const temperatureByte = parse8BitInteger(rawData, TemperatureBaseOffset);

    // First bit is the sign bit, which tells if the temperature is negative.
    const temperatureBase = temperatureByte & 0x7F;
    const isTemperatureNegative = ((temperatureByte >> 7) & 1) === 1;
    const temperatureFraction = parse8BitInteger(rawData, TemperatureFractionOffset) / 100;

    const temperature = temperatureBase + temperatureFraction;

    return isTemperatureNegative ? temperature * -1 : temperature;
};

/**
 * Parses the humidity from the advertisement.
 * One lsb is 0.5%, e.g. 128 is 64%. Values above 200 (100%) indicate a fault in sensor.
 *
 * @return Returns the value in percents (%)
 */
const parseRelativeHumidity = (rawData: Buffer): number => {
    return parse8BitInteger(rawData, HumidityOffset) * 0.5;
};

/**
 * Parses the battery voltage from the advertisement.
 *
 * @return Returns the value in Volts (V).
 */
const parseBatteryVoltage = (rawData: Buffer): number => {
    return parse16BitInteger(rawData, BatteryOffset) / 1000;
};

/**
 * Parses the Atmospheric pressure from the advertisement.
 * Values supported by the RuuviTag are 50000 Pa to 115536 Pa in 1 Pa increments.
 *
 * Example:
 * Value	Measurement
 * 00000	50000 Pa
 * 51325	101325 Pa (average sea-level pressure)
 * 65536	115536 Pa
 *
 * @return Returns the pressure in Pascals (Pa).
 */
const parsePressure = (rawData: Buffer): number => {
    const minimumSupportedPascalMeasurement = 50000;
    return parse16BitInteger(rawData, PressureOffset) + minimumSupportedPascalMeasurement;
};

/**
 * Parses the raw manufacturer specific data field according to the Data Format 3 Specification (RAWv1)
 * @see https://github.com/ruuvi/ruuvi-sensor-protocols/blob/master/dataformat_03.md
 */
const DataFormat3ParsingStrategy: RuuviTagParsingStrategy = {
    parse(rawRuuviTagData) {
        return {
            accelerationX: parseAcceleration(rawRuuviTagData, AccelerationXOffset),
            accelerationY: parseAcceleration(rawRuuviTagData, AccelerationYOffset),
            accelerationZ: parseAcceleration(rawRuuviTagData, AccelerationZOffset),
            batteryVoltage: parseBatteryVoltage(rawRuuviTagData),
            relativeHumidityPercentage: parseRelativeHumidity(rawRuuviTagData),
            pressure: parsePressure(rawRuuviTagData),
            temperature: parseTemperature(rawRuuviTagData),
            measurementSequence: null,
            movementCounter: null,
            txPower: null,
            macAddress: null,
        };
    },
};

export default DataFormat3ParsingStrategy;
