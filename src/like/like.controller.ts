import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { LikeService } from 'src/like/like.service';
import { CreateLikeDto } from 'src/like/dto/create.like.dto';
import { AuthenticatedRequest } from 'src/middlewares/interfaces/auth.middleware.interfaces';
import { Response } from 'express';

@ApiTags('Like')
@Controller('api')
export class LikeController {
    constructor(private readonly likeService: LikeService) {}

    @Get('/likes/:photoId')
    @ApiParam({ name: 'photoId' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getLikesCount(
        @Param('photoId') photoId: number,
        @Req() req: AuthenticatedRequest,
    ): Promise<any> {
        const likesCount = await this.likeService.findLikesCount({ userId: req.user.id, photoId });

        return { likesCount: likesCount.count };
    }

    @Post('/like')
    @ApiCreatedResponse()
    @ApiNotFoundResponse()
    async setLike(
        @Body() createLikeDto: CreateLikeDto,
        @Req() req: AuthenticatedRequest,
        @Res() res: Response,
    ): Promise<void> {
        const like = await this.likeService.findOne({
            userId: req.user.id,
            photoId: createLikeDto.photoId,
        });

        if (like) {
            await this.likeService.delete(like.id);
            res.json({
                message: 'Was disliked',
            });
        } else {
            await this.likeService.create({ userId: req.user.id, photoId: createLikeDto.photoId });
            res.json({
                message: 'Was liked',
            });
        }
    }
}
