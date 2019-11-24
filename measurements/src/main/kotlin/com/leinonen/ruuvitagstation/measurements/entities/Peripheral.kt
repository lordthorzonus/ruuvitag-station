package com.leinonen.ruuvitagstation.measurements.entities

data class Peripheral (
    val macAddress: String,
    val rssi: Long,
    val id: String
)
