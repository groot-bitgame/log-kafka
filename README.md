# 配置文件说明

```
{
    # 游戏名称
    gameName : '',
    
    # kafka 配置
    kafkaNode: {
        logWriteKafka: false,
        kafkaBrokers : '',
        kafkaTopics  : '',
    },
    
    # kafka 生产者
    producer : {
        requireAcks    : 1,
        ackTimeoutMs   : 100,
        partitionerType: 2,
    },
}
```
