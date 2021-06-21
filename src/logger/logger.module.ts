import { Module } from '@nestjs/common';
import { Logger } from 'src/logger/logger.service';

@Module({
    providers: [Logger],
    exports: [Logger],
})
export class LoggerModule {}
