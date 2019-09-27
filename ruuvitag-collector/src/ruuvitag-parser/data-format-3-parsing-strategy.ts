import { RuuviTagParsingStrategy, RuuviTagSensorData } from './index';

type MeasurementOffset = [number, number];

const ManufacturerIdOffset: MeasurementOffset = [0, 4];
const DataFormatOffset: MeasurementOffset = [4, 6];
const HumidityOffset: MeasurementOffset = [6, 8];
const TemperatureBaseOffset: MeasurementOffset = [8, 10];
const TemperatureFractionOffset: MeasurementOffset = [10, 12];
const PressureOffset: MeasurementOffset = [12, 16];
const AccelerationXOffset: MeasurementOffset = [16, 20];
const AccelerationYOffset: MeasurementOffset = [20, 24];
const AccelerationZOffset: MeasurementOffset = [24, 28];
const BatteryOffset: MeasurementOffset = [28, 32];

const parseMeasurementFromDataString = (rawDataString: string, dataOffset: MeasurementOffset): number => {
    const hexadecimalRadix = 16;
    return parseInt(rawDataString.substring(dataOffset[0], dataOffset[1]), hexadecimalRadix);
};

/**
 * Parses the acceleration data from the payload.
 * Values are 2-complement 16 bit signed integers. All channels are identical.
 *
 * Returns values in G.
 */
const parseAcceleration = (rawDataString: string, dataOffset: MeasurementOffset): number => {
    const twosComplement = (value: number): number => {
        const isValueNegative = (value & 0x8000) > 0;
        const max16IntValue = 0x10000;

        return isValueNegative ? (value - max16IntValue) : value;
    };

    const acceleration = twosComplement(parseMeasurementFromDataString(rawDataString, dataOffset));
    return acceleration / 1000;
};

/**
 * Parses the temperature from the payload.
 * Temperature is divided in base temperature which is a signed byte and fractions.
 *
 * Returns the value in Celsius (C).
 */
const parseTemperature = (rawDataString: string): number => {
    const temperatureByte = parseMeasurementFromDataString(rawDataString, TemperatureBaseOffset);

    // First bit is the sign bit which tells if the temperature is negative.
    const temperatureBase = temperatureByte & 0x7F;
    const isTemperatureNegative = ((temperatureByte >> 7) & 1) === 1;
    const temperatureFraction = parseMeasurementFromDataString(rawDataString, TemperatureFractionOffset) / 100;

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
    return parseMeasurementFromDataString(rawDataString, HumidityOffset) * 0.5;
};

/**
 * Parses the battery voltage from the payload.
 *
 * Returns the value in Volts (V).
 */
const parseBatteryVoltage = (rawDataString: string): number => {
    return parseMeasurementFromDataString(rawDataString, BatteryOffset) / 1000;
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
    return parseMeasurementFromDataString(rawDataString, PressureOffset) + minimumSupportedPascalMeasurement;
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
