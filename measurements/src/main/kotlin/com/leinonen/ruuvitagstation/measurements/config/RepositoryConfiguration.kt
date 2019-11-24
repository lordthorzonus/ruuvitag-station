package com.leinonen.ruuvitagstation.measurements.config

import com.leinonen.ruuvitagstation.measurements.repositories.InfluxDBRuuviTagMeasurementRepository
import com.leinonen.ruuvitagstation.measurements.repositories.RuuviTagMeasurementRepository
import org.influxdb.InfluxDB
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RepositoryConfiguration() {

    @Bean
    fun ruuviTagMeasurementRepository(@Qualifier("influxDBClient") influxDbClient: InfluxDB): RuuviTagMeasurementRepository {
        return InfluxDBRuuviTagMeasurementRepository(influxDbClient)
    }
}