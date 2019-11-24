package com.leinonen.ruuvitagstation.measurements.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import org.springframework.amqp.core.*
import org.springframework.amqp.rabbit.annotation.EnableRabbit
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory
import org.springframework.amqp.rabbit.connection.ConnectionFactory
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.amqp.support.converter.MessageConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

private const val RUUVITAG_EXCHANGE_NAME = "ruuvitag"
private const val MEASUREMENT_ROUTING_KEY = "ruuvitag.measurement"
const val RUUVITAG_MEASUREMENT_QUEUE_NAME = "ruuvitag-measurements"

@Configuration
@EnableRabbit
class RabbitMQConfiguration {

    @Bean
    fun rabbitTemplate(connectionFactory: ConnectionFactory): RabbitTemplate {
        val template = RabbitTemplate(connectionFactory)
        template.messageConverter = jsonMessageConverter()

        return template;
    }

    @Bean
    fun rabbitListenerContainerFactory(connectionFactory: ConnectionFactory): SimpleRabbitListenerContainerFactory {
        val factory = SimpleRabbitListenerContainerFactory()
        factory.setConnectionFactory(connectionFactory)
        factory.setBatchListener(true)
        factory.setBatchSize(5)
        factory.setConsumerBatchEnabled(true)
        factory.setMessageConverter(jsonMessageConverter())

        return factory
    }

    @Bean
    fun ruuviTagExchange(): TopicExchange {
        return TopicExchange(RUUVITAG_EXCHANGE_NAME)
    }

    @Bean
    fun jsonMessageConverter(): MessageConverter {
        return Jackson2JsonMessageConverter(ObjectMapper().registerKotlinModule());
    }

    @Bean
    fun ruuviTagMeasurementQueue(): Queue {
        val queue = Queue(RUUVITAG_MEASUREMENT_QUEUE_NAME, true)
        queue.setShouldDeclare(true)

        return queue
    }

    @Bean
    fun ruuviTagBinding(exchange: TopicExchange, queue: Queue): Binding {
        val binding = BindingBuilder.bind(queue).to(exchange).with(MEASUREMENT_ROUTING_KEY)
        binding.setShouldDeclare(true)

        return binding
    }
}