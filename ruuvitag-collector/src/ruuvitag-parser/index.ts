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

enum RuuvitagSensorProtocolDataFormat {
    DataFormat3= 0x03,
    DataFormat2And4 = 0x04,
    DataFormat5= 0x05,
}
