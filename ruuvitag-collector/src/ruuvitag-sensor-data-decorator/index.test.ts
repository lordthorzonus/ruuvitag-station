import Mock = jest.Mock;

jest.mock('./calculators/absolute-humidity-calculator');
jest.mock('./calculators/dew-point-calculator');
jest.mock('./calculators/heat-index-calculator');
jest.mock('./calculators/humidex-calculator');

import { RuuviTagSensorData } from '../ruuvitag-parser';
import decorateRuuviTagSensorDataWithCalculatedValues from './index';

const calculateAbsoluteHumidityMock: Mock = require(
    './calculators/absolute-humidity-calculator',
).calculateAbsoluteHumidity;
const calculateDewPointMock: Mock = require('./calculators/dew-point-calculator').calculateDewPoint;
const calculateHeatIndexMock: Mock = require('./calculators/heat-index-calculator').calculateHeatIndex;
const calculateHumidexMock: Mock = require('./calculators/humidex-calculator').calculateHumidex;

describe('RuuviTag sensor data decorator', () => {
    it('should enhance the given ruuvitag sensor data with calculations', () => {
        const ruuviTagSensorData: RuuviTagSensorData = {
            accelerationX: 1,
            accelerationY: 2,
            accelerationZ: 3,
            batteryVoltage: 100,
            pressure: 5000,
            relativeHumidityPercentage: 80,
            temperature: 20,
        };
        const dewPoint = 1;
        const absoluteHumidity = 2;
        const humidex = 30;
        const heatIndex = 27;

        calculateAbsoluteHumidityMock.mockReturnValue(absoluteHumidity);
        calculateDewPointMock.mockReturnValue(dewPoint);
        calculateHeatIndexMock.mockReturnValue(heatIndex);
        calculateHumidexMock.mockReturnValue(humidex);

        expect(decorateRuuviTagSensorDataWithCalculatedValues(ruuviTagSensorData)).toEqual(
            {
                ...ruuviTagSensorData,
                absoluteHumidity,
                dewPoint,
                humidex,
                heatIndex,
            },
        );

        expect(calculateAbsoluteHumidityMock).toBeCalledWith(
            ruuviTagSensorData.temperature,
            ruuviTagSensorData.relativeHumidityPercentage,
        );
        expect(calculateDewPointMock).toBeCalledWith(
            ruuviTagSensorData.temperature,
            ruuviTagSensorData.relativeHumidityPercentage,
        );
        expect(calculateHeatIndexMock).toBeCalledWith(
            ruuviTagSensorData.temperature,
            ruuviTagSensorData.relativeHumidityPercentage,
        );
        expect(calculateHumidexMock).toBeCalledWith(ruuviTagSensorData.temperature, dewPoint);
    });
});
