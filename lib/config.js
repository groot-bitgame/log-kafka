module.exports = {
    gameName : '',
    kafkaNode: {
        logWriteKafka: false,
        kafkaBrokers : '',
        kafkaTopics  : '',
    },
    producer : {
        requireAcks    : 1,
        ackTimeoutMs   : 100,
        partitionerType: 2,
    },
};
