import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikesEntity } from 'src/like/dal/likes.entity';
import { CreateLikePayload, Like } from 'src/like/interfaces/like.interfaces';

@Injectable()
export class LikeRepository {
    constructor(
        @InjectRepository(LikesEntity)
        private readonly likeRepository: Repository<LikesEntity>,
    ) {}

    async findLike(ids: { userId: number; photoId: number }): Promise<Like | undefined> {
        return await this.likeRepository.findOne({
            where: { userId: ids.userId, photoId: ids.photoId },
        });
    }

    async findLikesCount(ids: { userId: number; photoId: number }) {
        return await this.likeRepository
            .createQueryBuilder('likes')
            .select('COUNT(*)', 'count')
            .where('likes.photo_id = :photoId', { photoId: ids.photoId })
            .getRawOne();
    }

    async create(createLike: CreateLikePayload): Promise<void> {
        await this.likeRepository.insert(createLike);
    }

    async delete(likeId: number): Promise<void> {
        await this.likeRepository.delete(likeId);
    }
}
