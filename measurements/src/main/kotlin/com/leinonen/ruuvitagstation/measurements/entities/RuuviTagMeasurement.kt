package com.leinonen.ruuvitagstation.measurements.entities

import java.util.*

data class RuuviTagMeasurement (
        val id: UUID,
        val peripheral: Peripheral,
        val time: Date,
        val sensorData: RuuviTagSensorData
)