import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsEntity } from 'src/repositories/comments.entity';
import { Repository } from 'typeorm';
import { CommentAndUserFieldsFromDatabase } from 'src/comment/dal/comment.repository.interfaces';
import {
    CreateCommentPayload,
    UpdateCommentPayload,
} from 'src/comment/interfaces/comment.interfaces';

@Injectable()
export class CommentRepository {
    constructor(
        @InjectRepository(CommentsEntity)
        private readonly commentRepository: Repository<CommentsEntity>,
    ) {}

    async findAllComments(photoId: number): Promise<CommentAndUserFieldsFromDatabase[]> {
        return await this.commentRepository
            .createQueryBuilder('comments')
            .leftJoinAndSelect('users', 'u', 'u.user_id = comments.user_id')
            .where('comments.photo_id = :photoId', { photoId })
            .getRawMany();
    }

    async create(createCommentPayload: CreateCommentPayload): Promise<void> {
        await this.commentRepository.insert(createCommentPayload);
    }

    async update(commentId: number, updateCommentPayload: UpdateCommentPayload): Promise<void> {
        await this.commentRepository.update(commentId, updateCommentPayload);
    }

    async delete(commentId: number): Promise<void> {
        await this.commentRepository.delete(commentId);
    }
}
