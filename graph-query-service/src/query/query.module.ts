import { Module } from '@nestjs/common';
import { QueryController } from './query.controller';
import { QueryService } from './query.service';

@Module({
    providers:[QueryService],
    controllers:[QueryController],
    exports:[QueryService]
})
export class QueryModule {}
