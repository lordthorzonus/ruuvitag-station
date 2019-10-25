import { RuuviTagParsingStrategy } from './index';
import { ValueOffset } from './parse-value-from-hex-string';

const TemperatureOffset: ValueOffset = [3, 4];
const HumidityOffset: ValueOffset = [5, 6];
const PressureOffset: ValueOffset = [7, 8];
const AccelerationXOffset: ValueOffset = [9, 10];
const AccelerationYOffset: ValueOffset = [11, 12];
const AccelerationZOffset: ValueOffset = [13, 14];
const PowerInfoOffset: ValueOffset = [15, 16];
const MovementCounterOffset: ValueOffset = [17, 17];
const MeasurementSequenceOffset: ValueOffset = [18, 19];
const MacAddressOffset: ValueOffset = [20, 26];

const parse16BitInteger = (rawData: Buffer, byteOffset: ValueOffset): number => {
    return (rawData[byteOffset[0]] << 8 | rawData[byteOffset[1] & 0xFF]);
};

const isInvalidMeasurementForSigned16BitInteger = (value: number): boolean => {
    return value === 0x8000;
};

const isInvalidMeasurementForUnsigned16BitInteger = (value: number) => {
    return value === 0xFFFF;
};

const twosComplement = (value: number): number => {
    const isValueNegative = (value & 0x8000) > 0;
    const max16IntValue = 0x10000;

    return isValueNegative ? (value - max16IntValue) : value;
};

/**
 * Parses the temperature from the advertisement.
 * Values supported: (-163.835 °C to +163.835 °C in 0.005 °C increments.
 *
 * @return Returns the value in Celsius (C).
 */
const parseTemperature = (
    rawData: Buffer,
): number | null => {
    const temperature = parse16BitInteger(rawData, TemperatureOffset);
    const degreeIncrements = 0.005;

    if (isInvalidMeasurementForSigned16BitInteger(temperature)) {
        return null;
    }

    return twosComplement(temperature) * degreeIncrements;

};

/**
 * Parses the humidity from the advertisement.
 *
 * Values supported: 0.0 % to 100 % in 0.0025 % increments.
 * Higher values than 100 % are possible, but they generally indicate a faulty or miscalibrated sensor.
 *
 * Example
 * Value	Measurement
 * 000	    0%
 * 10010	25.025%
 * 40000	100.0%
 * 65535	Invalid / not available
 *
 * @return Returns the value in percents (%)
 */
const parseRelativeHumidity = (rawData: Buffer): number | null => {
    const humidity = parse16BitInteger(rawData, HumidityOffset);
    const percentageIncrements = 0.0025;

    if (isInvalidMeasurementForUnsigned16BitInteger(humidity)) {
        return null;
    }

    return humidity * percentageIncrements;
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
const parsePressure = (rawData: Buffer): number | null => {
    const pressure = parse16BitInteger(rawData, PressureOffset);
    const minimumSupportedPascalMeasurement = 50000;

    if (isInvalidMeasurementForUnsigned16BitInteger(pressure)) {
        return null;
    }

    return pressure + minimumSupportedPascalMeasurement;
};

/**
 * Parses the acceleration data from the advertisement.
 * Values are 2-complement 16 bit signed integers. All channels are identical.
 *
 * @return Returns values in G.
 */
const parseAcceleration = (rawData: Buffer, accelerationOffset: ValueOffset): number | null => {
    const acceleration = parse16BitInteger(rawData, accelerationOffset);

    if (isInvalidMeasurementForSigned16BitInteger(acceleration)) {
        return null;
    }

    return twosComplement(acceleration) / 1000;
};

/**
 * Parses the battery voltage from the advertisement.
 *
 * Power info (11+5bit unsigned), first 11 bits is the battery voltage above 1.6V, in millivolts (1.6V to 3.646V range).
 *
 * @return Returns the value in Volts (V).
 */
const parseBatteryVoltage = (rawData: Buffer): number | null => {
    const powerInfo = parse16BitInteger(rawData, PowerInfoOffset);
    const minimumVoltage = 1600;
    const max11BitUnsignedInteger = 2047;

    const voltage = (powerInfo >>> 5);

    if (voltage === max11BitUnsignedInteger) {
        return null;
    }

    return (voltage + minimumVoltage) / 1000;
};

/**
 * Parses the tx power from the advertisement.
 * Power info (11+5bit unsigned), last 5 bits unsigned are the TX power above -40dBm,
 * in 2dBm steps. (-40dBm to +20dBm range)
 *
 * @return Returns the value in dBm.
 */
const parseTxPower = (rawData: Buffer): number | null => {
    const powerInfo = parse16BitInteger(rawData, PowerInfoOffset);
    const max5BitUnsignedInteger = 31;
    const dBmIncrement = 2;
    const minimumDBm = -40;

    const txPower = (powerInfo & 0b11111);

    if (txPower === max5BitUnsignedInteger) {
        return null;
    }

    return txPower * dBmIncrement + minimumDBm;
};

/**
 * Parses the movement counter (8 bit unsigned) from the advertisement data.
 * Movement counter is one-byte counter which gets triggered when LIS2DH12 gives "activity interrupt".
 * Sensitivity depends on the firmware, by default the sensitivity is a movement over 64 mG.
 *
 * @return Movement counter as number
 */
const parseMovementCounter = (rawData: Buffer): number | null => {
    const movementCounter = rawData[MovementCounterOffset[0]] & 0xFF;
    const max8BitValue = 255;

    if (movementCounter === max8BitValue) {
        return null;
    }

    return movementCounter;
};

/**
 * Parses the measurement sequence from the advertisement.
 * Measurement sequence number gets incremented by one for every measurement.
 * It can be used to gauge signal quality and packet loss as well as to deduplicated data entries.
 *
 * @return Returns the measurement sequence as number.
 */
const parseMeasurementSequence = (rawData: Buffer): number | null => {
    const measurementSequence = parse16BitInteger(rawData, MeasurementSequenceOffset);

    if (isInvalidMeasurementForUnsigned16BitInteger(measurementSequence)) {
        return null;
    }

    return measurementSequence;
};

const parseMacAddress = (rawData: Buffer): string | null => {
    const macAddressData = rawData.slice(MacAddressOffset[0], MacAddressOffset[1]);
    const invalidMacAddress = 'ffffffffffff';
    const macAddress = macAddressData.toString('hex');

    if (macAddress === invalidMacAddress) {
        return null;
    }

    const macAddressArray = macAddress.match(/.{1,2}/g);

    return macAddressArray ? macAddressArray.join(':') : null;
};

const DataFormat5ParsingStrategy: RuuviTagParsingStrategy = {
    parse(rawRuuviTagData) {
        return {
            temperature: parseTemperature(rawRuuviTagData),
            relativeHumidityPercentage: parseRelativeHumidity(rawRuuviTagData),
            pressure: parsePressure(rawRuuviTagData),
            accelerationX: parseAcceleration(rawRuuviTagData, AccelerationXOffset),
            accelerationY: parseAcceleration(rawRuuviTagData, AccelerationYOffset),
            accelerationZ: parseAcceleration(rawRuuviTagData, AccelerationZOffset),
            batteryVoltage: parseBatteryVoltage(rawRuuviTagData),
            txPower: parseTxPower(rawRuuviTagData),
            movementCounter: parseMovementCounter(rawRuuviTagData),
            measurementSequence: parseMeasurementSequence(rawRuuviTagData),
            macAddress: parseMacAddress(rawRuuviTagData),
        };
    },
};

export default DataFormat5ParsingStrategy;
