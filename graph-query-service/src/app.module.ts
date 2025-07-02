import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueryModule } from './query/query.module';
import { KafkaModule } from './kafka/kafka.module';
import { AuthVerificationModule } from './auth-verification/auth-verification.module';

@Module({
  imports: [QueryModule, KafkaModule, AuthVerificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
