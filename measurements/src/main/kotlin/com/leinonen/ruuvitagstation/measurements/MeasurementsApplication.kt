package com.leinonen.ruuvitagstation.measurements

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MeasurementsApplication

fun main(args: Array<String>) {
	runApplication<MeasurementsApplication>(*args)
}
