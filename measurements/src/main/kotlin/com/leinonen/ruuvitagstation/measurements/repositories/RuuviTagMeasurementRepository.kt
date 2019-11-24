package com.leinonen.ruuvitagstation.measurements.repositories

import com.leinonen.ruuvitagstation.measurements.entities.RuuviTagMeasurement
import reactor.core.publisher.Flux

interface RuuviTagMeasurementRepository {
    fun save(measurements: List<RuuviTagMeasurement>): Unit
}