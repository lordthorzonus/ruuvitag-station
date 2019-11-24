package com.leinonen.ruuvitagstation.measurements.entities

data class RuuviTagSensorData (
    val accelerationX: Double? = null,
    val accelerationY: Double? = null,
    val accelerationZ: Double? = null,
    val batteryVoltage: Double? = null,
    val relativeHumidityPercentage: Double? = null,
    val pressure: Long? = null,
    val temperature: Double? = null,
    val measurementSequence: Long? = null,
    val movementCounter: Long? = null,
    val txPower: Long? = null,
    val macAddress: Long? = null,
    val humidex: Long? = null,
    val heatIndex: Long? = null,
    val dewPoint: Double? = null,
    val absoluteHumidity: Double? = null
)
