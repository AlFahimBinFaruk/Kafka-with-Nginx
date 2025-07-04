import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Consumer, Admin } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private admin: Admin;

  constructor() {
    this.kafka = new Kafka({
      brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
      clientId: process.env.KAFKA_CLIENTID || 'graph-query-service',
      retry: {
        initialRetryTime: 3000, // 3 seconds between retries
        retries: 10, // try up to 10 times
      },
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: process.env.KAFKA_GROUPID || 'graph-query-group',
    });
    this.admin = this.kafka.admin();
  }

  private async createTopicsIfNotExist() {
    await this.admin.createTopics({
      topics: [
        {
          topic:
            process.env.KAFKA_VERIFY_REQUEST || 'auth.token.verify.request',
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic:
            process.env.KAFKA_VERIFY_RESPONSE || 'auth.token.verify.response',
          numPartitions: 3,
          replicationFactor: 1,
        },
      ],
      waitForLeaders: true,
    });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.admin.connect();
    await this.createTopicsIfNotExist();
    await this.admin.disconnect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async send(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async consume(topic: string, callback: (message: any) => void) {
    await this.consumer.subscribe({ topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const value = message.value?.toString();
        if (value) {
          callback(JSON.parse(value));
        }
      },
    });
  }
}
