import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsEntity } from 'src/comment/dal/comments.entity';
import { Repository } from 'typeorm';
import { CommentAndUserFieldsFromDatabase } from 'src/comment/dal/comment.repository.interfaces';
import {
    CommentWithUser,
    CreateCommentPayload,
    UpdateCommentPayload,
    Comment,
} from 'src/comment/interfaces/comment.interfaces';

@Injectable()
export class CommentRepository {
    constructor(
        @InjectRepository(CommentsEntity)
        private readonly commentRepository: Repository<CommentsEntity>,
    ) {}

    async findComments(photoId: number): Promise<CommentWithUser[]> {
        const comments = await this.commentRepository
            .createQueryBuilder('comments')
            .leftJoinAndSelect('users', 'u', 'u.user_id = comments.user_id')
            .where('comments.photo_id = :photoId', { photoId })
            .orderBy('comment_id', 'DESC')
            .getRawMany();

        return comments.map((comment: CommentAndUserFieldsFromDatabase) => ({
            commentId: comment.comments_comment_id,
            text: comment.comments_text,
            nickname: comment.u_nickname,
            userId: comment.u_user_id,
        }));
    }

    async findComment(commentId: number): Promise<Comment | undefined> {
        return await this.commentRepository.findOne({ where: { id: commentId } });
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
