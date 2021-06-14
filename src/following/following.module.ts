import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowingEntity } from 'src/repositories/following.entity';
import { FollowingService } from 'src/following/following.service';

@Module({
    imports: [TypeOrmModule.forFeature([FollowingEntity])],
    providers: [FollowingService],
    controllers: [],
})
export class FollowingModule {}
