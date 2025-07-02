import { Module } from '@nestjs/common';
import { AuthVerificationService } from './auth-verification.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports:[KafkaModule,UserModule,JwtModule],
    providers:[AuthVerificationService],
    exports:[AuthVerificationService]
})
export class AuthVerificationModule {}
