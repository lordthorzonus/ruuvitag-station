package com.leinonen.ruuvitagstation.measurements.config

import org.influxdb.InfluxDB
import org.influxdb.InfluxDBFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class InfluxDBConfiguration {

    @Value("\${influxdb.url}")
    private lateinit var url: String

    @Value("\${influxdb.username}")
    private lateinit var username: String

    @Value("\${influxdb.password}")
    private lateinit var password: String

    @Value("\${influxdb.database}")
    private lateinit var databaseName: String

    @Bean
    fun influxDBClient(): InfluxDB {
        val client = InfluxDBFactory.connect(url, username, password)
        return client.setDatabase(databaseName).enableBatch().enableGzip()
    }
}