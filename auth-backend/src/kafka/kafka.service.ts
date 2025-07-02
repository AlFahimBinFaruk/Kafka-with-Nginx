import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer, Admin } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private admin: Admin;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'auth-backend',
      brokers: ['172.16.208.74:9092'],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'auth-group' });
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

  async send(topic: string, message: any, key?: string) {
    await this.producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(message),
        },
      ],
    });
  }

  async consume(topic: string, handler: (message: any) => Promise<void>) {
    await this.consumer.subscribe({ topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        // console.log(`[Kafka] Message received on topic: ${topic}`);
        const payload = message.value?.toString()
        if(payload){
            await handler(JSON.parse(payload));
        }else{
          console.log("Auth backend payload is empty.")
        }
      },
    });
  }
}