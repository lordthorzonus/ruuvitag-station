# ruuvitag-station
Weather station for usage with ruuvitags.

## Domain events

### New RuuviTag Measurement
Emitted every time a RuuviTag advertises a new BLE advertisement.
- Routing Key: `ruuvitag.measurement`
- Exchange: `ruuvitag`
- Body:
```typescript
type RuuviTagMeasurement = {
  id: string;
  time: Date;
  peripheral: {
    macAddress: string;
    id: string;
    rssi: number
  };
  sensorData: {
    relativeHumidityPercentage: number;
    temperature: number;
    pressure: number;
    accelerationX: number;
    accelerationY: number;
    accelerationZ: number;
    batteryVoltage: number;
    txPower: number;
    movementCounter: number;
    measurementSequence: number;
    macAddress: string;
    humidex: number;
    heatIndex: number;
    dewPoint: number;
    absoluteHumidity: number;
  }
}
```
- Headers:
    - `ruuvitag-collector-id`

### New RuuviTag Discovered
Emitted when a collector registers a new RuuviTag.

- Routing Key: `ruuvitag.discovered`
- Exchange: `ruuvitag`
- Body:
```typescript
type RuuviTagDiscovered = {
  macAddress: string;
  id: string;
  rssi: number
};
```
- Headers:
    - `ruuvitag-collector-id`

## Structure

### Ruuvitag collector
Service to be deployed to for example a raspberry pi which is physically in same location as the ruuvitags. Publishes events to RabbitMQ.

#### Environment variables
`ENABLE_RUUVITAG_COLLECTOR_LOGGING` defaults to false. If set to true logs the events also to the console.

`RUUVITAG_COLLECTOR_ID` Set this to a unique id that identifies the collector if you have for example multiple collectors in different locations.

Related to RabbitMQ connection:
```
RABBITMQ_HOSTNAME=
RABBITMQ_PROTOCOL=
RABBITMQ_USERNAME=
RABBITMQ_PASSWORD=
```


### Measurements service
Microservice which handles persisting the measurements to InfluxDB

#### Environment variables
Related to RabbitMQ connection:
```
RABBITMQ_HOSTNAME=
RABBITMQ_PROTOCOL=
RABBITMQ_USERNAME=
RABBITMQ_PASSWORD=
```

Related to influxDB Connection:

```
INFLUX_DB_URL=
INFLUX_DB_USERNAME=
INFLUX_DB_PASSWORD=
INFLUX_DB_DATABASE_NAME=
```


## External services
- Grafana
- Chronograf