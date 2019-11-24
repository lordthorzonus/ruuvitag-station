package com.leinonen.ruuvitagstation.measurements.repositories

import com.leinonen.ruuvitagstation.measurements.entities.RuuviTagMeasurement
import org.influxdb.InfluxDB
import org.influxdb.dto.BatchPoints
import org.influxdb.dto.Point
import java.util.concurrent.TimeUnit

private val INFLUX_DB_MEASUREMENT_NAME = "ruuvitag_measurement"

class InfluxDBRuuviTagMeasurementRepository(private val influxDBClient: InfluxDB): RuuviTagMeasurementRepository  {
    override fun save(measurements: List<RuuviTagMeasurement>): Unit {
        val points = measurements.map { transformRuuviTagMeasurementToPoint(it) }
        return influxDBClient.write(BatchPoints.builder().points(points).build());
    }

    private fun transformRuuviTagMeasurementToPoint(measurement: RuuviTagMeasurement): Point {
        return Point.measurement(INFLUX_DB_MEASUREMENT_NAME)
                .tag("sensor_id", measurement.peripheral.id)
                .tag("sensor_mac_address", measurement.peripheral.macAddress)
                .time(measurement.time.time, TimeUnit.MILLISECONDS)
                .addField("acceleration_x", measurement.sensorData.accelerationX)
                .addField("acceleration_z", measurement.sensorData.accelerationZ)
                .addField("acceleration_y", measurement.sensorData.accelerationY)
                .addField("battery_voltage", measurement.sensorData.batteryVoltage)
                .addField("relative_humidity_percentage", measurement.sensorData.relativeHumidityPercentage)
                .addField("pressure", measurement.sensorData.pressure)
                .addField("temperature", measurement.sensorData.temperature)
                .addField("measurement_sequence", measurement.sensorData.measurementSequence)
                .addField("movement_counter", measurement.sensorData.movementCounter)
                .addField("tx_power", measurement.sensorData.txPower)
                .addField("humidex", measurement.sensorData.humidex)
                .addField("heat_index", measurement.sensorData.heatIndex)
                .addField("dew_point", measurement.sensorData.dewPoint)
                .addField("absolute_humidity", measurement.sensorData.absoluteHumidity)
                .addField("rssi", measurement.peripheral.rssi)
                .build()
    }
}