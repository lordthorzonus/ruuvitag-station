# ruuvitag-station
Weather station for usage with ruuvitags.

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
