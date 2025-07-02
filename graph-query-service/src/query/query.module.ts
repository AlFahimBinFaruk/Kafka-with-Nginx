import { Module } from '@nestjs/common';
import { QueryController } from './query.controller';
import { QueryService } from './query.service';
import { AuthVerificationModule } from '../auth-verification/auth-verification.module';

@Module({
    imports:[AuthVerificationModule],
    providers:[QueryService],
    controllers:[QueryController],
    exports:[QueryService]
})
export class QueryModule {}
