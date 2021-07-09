import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesEntity } from 'src/like/dal/likes.entity';
import { LikeService } from 'src/like/like.service';
import { LikeRepository } from 'src/like/dal/like.repository';
import { LikeController } from 'src/like/like.controller';

@Module({
    imports: [TypeOrmModule.forFeature([LikesEntity])],
    providers: [LikeRepository, LikeService],
    controllers: [LikeController],
})
export class LikeModule {}
