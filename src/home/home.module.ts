import { Module } from '@nestjs/common';
import { HomeController } from 'src/home/home.controller';

@Module({
    controllers: [HomeController],
})
export class HomeModule {}
