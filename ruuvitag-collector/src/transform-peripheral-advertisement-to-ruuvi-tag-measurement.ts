import { Peripheral } from '@abandonware/noble';
import { flow } from 'lodash';
import parse from './ruuvitag-parser';
import decorateRuuviTagSensorDataWithCalculatedValues, { EnhancedRuuviTagSensorData } from './ruuvitag-sensor-data-decorator';

export interface RuuviTagMeasurement {
    macAddress: string;
    id: string;
    rssi: number;
    time: Date;
    sensorData: EnhancedRuuviTagSensorData;
}

const getSensorData = flow(
    parse,
    decorateRuuviTagSensorDataWithCalculatedValues,
);

export const transformPeripheralAdvertisementToRuuviTagMeasurement = (peripheral: Peripheral): RuuviTagMeasurement => {
    return {
        macAddress: peripheral.address,
        rssi: peripheral.rssi,
        id: peripheral.id,
        time: new Date(),
        sensorData: getSensorData(peripheral.advertisement.manufacturerData),
    };
};
