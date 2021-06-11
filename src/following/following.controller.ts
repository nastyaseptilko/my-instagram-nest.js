import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { FollowingService } from './following.service';
import { AuthenticatedRequest } from 'src/middlewares/interfaces/auth.middleware.interfaces';
import { Response } from 'express';

@ApiTags('Photo')
@Controller('/api')
export class FollowingController {
    constructor(private readonly followingService: FollowingService) {}

    @Get('/publishers')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getPublishers(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
        const publishers = await this.followingService.findAllPublishers(req.user.id);
        console.log(publishers, 'publishers');
        res.render('profile', {
            title: 'Profile',
            layout: 'profile',
            allowViewPublishers: true,
            publishers: publishers,
        });
    }
}
