import { Peripheral } from '@abandonware/noble';
import { flow } from 'lodash';
import * as uuid from 'uuid/v4';
import parse from './ruuvitag-parser';
import decorateRuuviTagSensorDataWithCalculatedValues, { EnhancedRuuviTagSensorData } from './ruuvitag-sensor-data-decorator';

export interface RuuviTag {
    macAddress: string;
    id: string;
    rssi: number;
}

export interface RuuviTagMeasurement {
    id: string;
    peripheral: RuuviTag;
    time: Date;
    sensorData: EnhancedRuuviTagSensorData;
}

const getSensorData = flow(
    parse,
    decorateRuuviTagSensorDataWithCalculatedValues,
);

export const transformPeripheralAdvertisementToRuuviTagMeasurement = (peripheral: Peripheral): RuuviTagMeasurement => {
    const sensorData = getSensorData(peripheral.advertisement.manufacturerData);
    const macAddress = sensorData.macAddress || peripheral.address;

    return {
        id: uuid(),
        peripheral: {
            macAddress,
            rssi: peripheral.rssi,
            id: peripheral.id,
        },
        time: new Date(Date.now()),
        sensorData,
    };
};
