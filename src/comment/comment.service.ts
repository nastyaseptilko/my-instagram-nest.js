import { Injectable } from '@nestjs/common';
import {
    Comment,
    CommentWithUser,
    CreateCommentPayload,
    ReplaceEmailsParams,
    UpdateCommentPayload,
} from 'src/comment/interfaces/comment.interfaces';
import { UserService } from 'src/user/user.service';
import { CommentRepository } from 'src/comment/dal/comment.repository';

@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly userService: UserService,
    ) {}

    async findComments(photoId: number): Promise<CommentWithUser[]> {
        return await this.commentRepository.findComments(photoId);
    }

    async findComment(commentId: number): Promise<Comment | undefined> {
        return await this.commentRepository.findComment(commentId);
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
