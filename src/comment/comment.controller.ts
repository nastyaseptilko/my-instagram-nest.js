import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
import { CommentService } from 'src/comment/comment.service';
import { Response } from 'express';
import { AuthenticatedRequest } from 'src/middlewares/interfaces/auth.middleware.interfaces';
import { CreateCommentDto } from 'src/comment/dto/create.comment.dto';
import { UpdateCommentDto } from 'src/comment/dto/update.comment.dto';

@ApiTags('Comment')
@Controller('/api')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get('comment/:photoId')
    @ApiParam({ name: 'photoId' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getComments(
        @Req() req: AuthenticatedRequest,
        @Res() res: Response,
        @Param('photoId') photoId: number,
    ): Promise<void> {
        const comments = await this.commentService.findAllComments(photoId);
        res.render('comments', {
            title: 'Comment',
            layout: 'comments',
            comments: comments.map(c => ({
                ...c,
                allowEdit: Number(req.user.id) === c.userId,
            })),
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
        console.log(photoId, 'photoId');
        console.log(createCommentDto.text, 'createCommentDto.text');
        await this.commentService.create({
            text: createCommentDto.text,
            userId: req.user.id,
            photoId,
        });
    }

    @Put('comment/:commentId')
    @ApiParam({ name: 'commentId' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async updateComment(
        @Param('commentId') commentId: number,
        @Body() updateCommentDto: UpdateCommentDto,
    ): Promise<void> {
        await this.commentService.update(commentId, updateCommentDto);
    }

    @Delete('comment/:commentId')
    @ApiParam({ name: 'commentId' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async deleteComment(@Param('commentId') commentId: number): Promise<void> {
        await this.commentService.delete(commentId);
    }
}
