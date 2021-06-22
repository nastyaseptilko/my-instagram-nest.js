import { Injectable } from '@nestjs/common';
import {
    CommentWithUser,
    CreateCommentPayload,
    ReplaceEmailsParams,
    UpdateCommentPayload,
} from 'src/comment/interfaces/comment.interfaces';
import { UserService } from 'src/user/user.service';
import { CommentAndUserFieldsFromDatabase } from 'src/comment/DAL/comment.repository.interfaces';
import { CommentRepository } from 'src/comment/DAL/comment.repository';

@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly userService: UserService,
    ) {}

    async findComments(photoId: number): Promise<CommentWithUser[]> {
        const comments = await this.commentRepository.findAllComments(photoId);

        return comments.map((comment: CommentAndUserFieldsFromDatabase) => ({
            commentId: comment.comments_comment_id,
            text: comment.comments_text,
            nickname: comment.u_nickname,
            userId: comment.u_user_id,
        }));
    }

    async create(createCommentPayload: CreateCommentPayload): Promise<void> {
        await this.commentRepository.create(createCommentPayload);
    }

    async update(commentId: number, updateCommentPayload: UpdateCommentPayload): Promise<void> {
        await this.commentRepository.update(commentId, updateCommentPayload);
    }

    async delete(commentId: number): Promise<void> {
        await this.commentRepository.delete(commentId);
    }

    async replaceEmails(replaceEmailsParams: ReplaceEmailsParams): Promise<string> {
        const matchUsers = await this.userService.findUsersByEmails(replaceEmailsParams.emails);
        let comment = replaceEmailsParams.comment;

        for (const matchUser of matchUsers) {
            comment = comment.replace(`@${matchUser.email}`, matchUser.nickname);
        }
        return comment;
    }
}
