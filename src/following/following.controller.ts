import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { Controller, Delete, Param, Post, Req } from '@nestjs/common';
import { FollowingService } from 'src/following/following.service';
import { AuthenticatedRequest } from 'src/middlewares/interfaces/auth.middleware.interfaces';

@ApiTags('Following')
@Controller('/api')
export class FollowingController {
    constructor(private readonly followingService: FollowingService) {}

    @Post('/follow/:publisherId')
    @ApiParam({ name: 'publisherId' })
    @ApiCreatedResponse()
    @ApiNotFoundResponse()
    async createFollowing(
        @Param('publisherId') publisherId: number,
        @Req() req: AuthenticatedRequest,
    ): Promise<void> {
        await this.followingService.follow({
            subscriber: req.user.id,
            publisher: publisherId,
        });
    }

    @Delete('/unfollow/:followingId')
    @ApiParam({ name: 'followingId' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async deleteFollowing(@Param('followingId') followingId: number): Promise<void> {
        await this.followingService.unfollow(followingId);
    }
}
