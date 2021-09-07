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
import { AuthenticatedRequest } from 'src/auth/interfaces/auth.middleware.interfaces';
import { Response } from 'express';
import { toPresentation } from 'src/presentation.response';

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
        @Res() res: Response,
    ): Promise<any> {
        const likesCount = await this.likeService.findLikesCount({ userId: req.user.id, photoId });

        return toPresentation({
            req,
            res,
            data: { likesCount: likesCount.count },
        });
    }

    @Post('/like')
    @ApiCreatedResponse()
    @ApiNotFoundResponse()
    async setLike(
        @Body() createLikeDto: CreateLikeDto,
        @Req() req: AuthenticatedRequest,
        @Res() res: Response,
    ): Promise<void> {
        const like = await this.likeService.findLike({
            userId: req.user.id,
            photoId: createLikeDto.photoId,
        });

        if (like && req.user.id === like.userId) {
            await this.likeService.delete(like.id);
            return toPresentation({
                req,
                res,
                data: { message: 'Was disliked' },
            });
        } else {
            await this.likeService.create({ userId: req.user.id, photoId: createLikeDto.photoId });
            return toPresentation({
                req,
                res,
                data: { message: 'Was liked' },
            });
        }
    }
}
