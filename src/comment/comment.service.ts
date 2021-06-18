import { Injectable } from '@nestjs/common';
import { CommentsEntity } from 'src/repositories/comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    CommentAndUserFieldsFromDatabase,
    CommentWithUser,
    CreateCommentPayload,
    UpdateCommentPayload,
} from 'src/comment/interfaces/comment.interfaces';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentsEntity)
        private readonly commentRepository: Repository<CommentsEntity>,
    ) {}

    async findAllComments(photoId: number): Promise<CommentWithUser[]> {
        const comments = await this.commentRepository
            .createQueryBuilder('comments')
            .leftJoinAndSelect('users', 'u', 'u.user_id = comments.user_id')
            .where('comments.photo_id = :photoId', { photoId })
            .getRawMany();

        return comments.map((comment: CommentAndUserFieldsFromDatabase) => ({
            commentId: comment.comments_comment_id,
            text: comment.comments_text,
            userName: comment.u_userName,
            userId: comment.u_user_id,
        }));
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
