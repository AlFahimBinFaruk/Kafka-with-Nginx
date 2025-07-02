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
      brokers: ['172.16.208.74:9092'],
      clientId: 'graph-query-service',
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'graph-query-group' });
    this.admin = this.kafka.admin();
  }

  private async createTopicsIfNotExist() {
    await this.admin.createTopics({
      topics: [
        {
          topic: 'auth.token.verify.request',
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic: 'auth.token.verify.response',
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
