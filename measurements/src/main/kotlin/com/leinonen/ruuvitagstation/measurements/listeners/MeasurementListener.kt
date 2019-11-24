package com.leinonen.ruuvitagstation.measurements.listeners

import com.leinonen.ruuvitagstation.measurements.config.RUUVITAG_MEASUREMENT_QUEUE_NAME
import com.leinonen.ruuvitagstation.measurements.entities.RuuviTagMeasurement
import com.leinonen.ruuvitagstation.measurements.repositories.RuuviTagMeasurementRepository
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component

@Component
class MeasurementListener (val ruuviTagMeasurementRepository: RuuviTagMeasurementRepository){

    @RabbitListener(id="onRuuviTagMeasurement", queues = [RUUVITAG_MEASUREMENT_QUEUE_NAME])
    fun onRuuviTagMeasurement(ruuviTagMeasurements: List<RuuviTagMeasurement>) {
        ruuviTagMeasurementRepository.save(ruuviTagMeasurements)
    }
}