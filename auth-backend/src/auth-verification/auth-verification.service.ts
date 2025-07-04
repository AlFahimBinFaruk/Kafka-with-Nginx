import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthVerificationService implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private userService: UserService,
  ) {}

  async onModuleInit() {
    // console.log("Auth backend init module")
    await this.kafkaService.consume(
      process.env.KAFKA_VERIFY_REQUEST || 'auth.token.verify.request',
      this.handleTokenRequest.bind(this),
    );
  }

  private async handleTokenRequest(payload: { jwt: string; reqId: string }) {
    const { jwt: token, reqId } = payload;
    let result = false;

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = this.jwtService.verify(token, { secret });
      const userId = decoded.sub;
      const userDetails = await this.userService.findById(userId);
      // console.log("user id => ",userId," ","Details => ",userDetails)
      if (userDetails) {
        result = true;
      }
    } catch (e) {
      result = false;
    }

    await this.kafkaService.send(
      process.env.KAFKA_VERIFY_RESPONSE || 'auth.token.verify.response',
      { reqId, result },
      reqId,
    );
  }
}
