import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    Res,
} from '@nestjs/common';
import { CommentService } from 'src/comment/comment.service';
import { Response } from 'express';
import { AuthenticatedRequest } from 'src/auth/interfaces/auth.middleware.interfaces';
import { CreateCommentDto } from 'src/comment/dto/create.comment.dto';
import { UpdateCommentDto } from 'src/comment/dto/update.comment.dto';
import { EmailService } from 'src/email/email.service';
import { toPresentation } from '../presentation.response';

@ApiTags('Comment')
@Controller('/api')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private readonly emailService: EmailService,
    ) {}

    @Get('comment/:photoId')
    @ApiParam({ name: 'photoId' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getComments(
        @Req() req: AuthenticatedRequest,
        @Res() res: Response,
        @Param('photoId') photoId: number,
    ): Promise<void> {
        const comments = await this.commentService.findComments(photoId);
        return toPresentation({
            req,
            res,
            data: {
                comments: comments.map(c => ({
                    ...c,
                    isAllowEdit: Number(req.user.id) === c.userId,
                })),
            },
            render: {
                viewName: 'comments',
                options: {
                    title: 'Comment',
                    layout: 'comments',
                    comments: comments.map(c => ({
                        ...c,
                        isAllowEdit: Number(req.user.id) === c.userId,
                    })),
                },
            },
        });
    }

    @Post('comment/:photoId')
    @ApiParam({ name: 'photoId' })
    @ApiCreatedResponse()
    @ApiNotFoundResponse()
    async createComment(
        @Req() req: AuthenticatedRequest,
        @Param('photoId') photoId: number,
        @Body() createCommentDto: CreateCommentDto,
    ): Promise<void> {
        const emails = await this.emailService.searchEmails(createCommentDto.text);

        const comment = await this.commentService.replaceEmails({
            emails,
            comment: createCommentDto.text,
        });

        await this.commentService.create({
            text: comment,
            userId: req.user.id,
            photoId,
        });

        await this.emailService.sendEmails({
            text: createCommentDto.text,
            emails,
        });
    }

    @Put('comment/:commentId')
    @ApiParam({ name: 'commentId' })
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async updateComment(
        @Param('commentId') commentId: number,
        @Req() req: AuthenticatedRequest,
        @Body() updateCommentDto: UpdateCommentDto,
    ): Promise<void> {
        const comment = await this.commentService.findComment(commentId);

        if (comment && req.user.id === comment.userId) {
            await this.commentService.update(commentId, updateCommentDto);
        } else {
            throw new BadRequestException('You have no way to update the comment');
        }
    }

    @Delete('comment/:commentId')
    @ApiParam({ name: 'commentId' })
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async deleteComment(
        @Param('commentId') commentId: number,
        @Req() req: AuthenticatedRequest,
    ): Promise<void> {
        const comment = await this.commentService.findComment(commentId);

        if (comment && req.user.id === comment.userId) {
            await this.commentService.delete(commentId);
        } else {
            throw new BadRequestException('You have no way to delete the comment');
        }
    }
}
