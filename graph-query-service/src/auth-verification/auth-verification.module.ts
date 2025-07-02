import { Module } from '@nestjs/common';
import { AuthVerificationService } from './auth-verification.service';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
    providers:[AuthVerificationService],
    exports:[AuthVerificationService],
    imports:[KafkaModule]
})
export class AuthVerificationModule {}
