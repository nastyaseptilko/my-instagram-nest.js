import { Injectable } from '@nestjs/common';
import { LikeRepository } from 'src/like/dal/like.repository';
import { CreateLikePayload, Like } from 'src/like/interfaces/like.interfaces';

@Injectable()
export class LikeService {
    constructor(private readonly likeRepository: LikeRepository) {}

    async findOne(ids: { userId: number; photoId: number }): Promise<Like | undefined> {
        return await this.likeRepository.findOne(ids);
    }

    async findLikesCount(ids: { userId: number; photoId: number }) {
        return await this.likeRepository.findLikesCount(ids);
    }

    async create(createLike: CreateLikePayload): Promise<void> {
        await this.likeRepository.create(createLike);
    }

    async delete(likeId: number): Promise<void> {
        await this.likeRepository.delete(likeId);
    }
}
