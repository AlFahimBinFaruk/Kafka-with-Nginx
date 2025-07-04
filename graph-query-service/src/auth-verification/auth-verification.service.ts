import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from 'src/kafka/kafka.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthVerificationService implements OnModuleInit {
  private pendingRequests = new Map<string, (result: boolean) => void>();

  constructor(private readonly kafkaService: KafkaService) {}

  async onModuleInit() {
    await this.kafkaService.consume(
      process.env.KAFKA_VERIFY_RESPONSE || 'auth.token.verify.response',
      async (msg) => {
        const { reqId, result } = msg;
        console.log(`Processing response for ${reqId}`);
        const resolver = this.pendingRequests.get(reqId);
        if (resolver) {
          resolver(result);
          this.pendingRequests.delete(reqId);
        }
      },
    );
  }

  async verifyToken(jwt: string): Promise<boolean> {
    const reqId = uuidv4();

    const payload = {
      jwt,
      reqId,
    };

    await this.kafkaService.send(
      process.env.KAFKA_VERIFY_REQUEST || 'auth.token.verify.request',
      payload,
    );
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(reqId, resolve);
      // console.log("Sending req.....")
      setTimeout(() => {
        this.pendingRequests.delete(reqId);
        reject(new Error('Auth timeout'));
      }, 3000); // 3 seconds timeout
    });
  }
}
