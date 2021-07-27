const _        = require('lodash');
const kafka    = require('kafka-node');
const os       = require('os');
const Client   = kafka.KafkaClient;
const Producer = kafka.Producer;
const config   = require('./config');

/**
 * log-kafka
 * @param options
 * {
 *   gameName     : '',
 *   kafkaNode    : {
 *       logWriteKafka: false,
 *       kafkaBrokers : '',
 *       kafkaTopics  : '',
 *   },
 *   producer: {
 *       requireAcks    : 1,
 *       ackTimeoutMs   : 100,
 *       partitionerType: 2,
 *   },
}
 */
exports.init = (options) => {
    if (_.size(options) <= 0) {
        return;
    }

    let newOptions = _.merge(_.cloneDeep(config), options);

    let kafkaNode = newOptions.kafkaNode || {};
    if (_.size(kafkaNode) <= 0) {
        return;
    }

    // 未启用 kafka 日志
    let logWriteKafka = kafkaNode.logWriteKafka || false;
    if (!logWriteKafka) {
        return;
    }

    // kafka 集群列表
    let kafkaBrokers = kafkaNode.kafkaBrokers || '';
    if (_.size(kafkaBrokers) <= 0) {
        return;
    }

    // kafka topic
    let kafkaTopics = kafkaNode.kafkaTopics;
    if (_.size(kafkaTopics) <= 0) {
        return;
    }

    // 实例化 kafka producer
    let client   = new Client({kafkaHost: kafkaBrokers});
    let producer = new Producer(client, newOptions.producer || {});
    producer.on('ready', function () {

        exports.send = (level, msg) => {
            let appName = newOptions.gameName || '';

            let payloads = [
                {
                    topic     : kafkaTopics,
                    messages  : JSON.stringify({
                        appName: appName,
                        host   : getIPAddress(),
                        level  : level,
                        message: msg,
                        date   : new Date(),
                        type   : 'log',
                    }),
                    attributes: 1,
                },
            ];

            producer.send(payloads, function (err, data) {
            });
        };
    });
};

/**
 * 发送 kafka 消息
 * @param level
 * @param msg
 */
exports.sendMessage = (level, msg) => {
    if (_.isFunction(exports.send)) {
        exports.send(level, msg);
    }
};

function getIPAddress() {
    let interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
        if (!interfaces.hasOwnProperty(devName)) {
            continue;
        }

        let iFace = interfaces[devName];
        for (let i = 0; i < iFace.length; i++) {
            let alias = iFace[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }

    return '';
}
