import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowingEntity } from 'src/repositories/following.entity';
import { FollowingService } from 'src/following/following.service';
import { FollowingController } from 'src/following/following.controller';

@Module({
    imports: [TypeOrmModule.forFeature([FollowingEntity])],
    providers: [FollowingService],
    controllers: [FollowingController],
})
export class FollowingModule {}
