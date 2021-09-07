import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { BadRequestException, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import { FollowingService } from 'src/following/following.service';
import { AuthenticatedRequest } from 'src/auth/interfaces/auth.middleware.interfaces';

@ApiTags('Following')
@Controller('/api')
export class FollowingController {
    constructor(private readonly followingService: FollowingService) {}

    @Post('/follow/:publisherId')
    @ApiParam({ name: 'publisherId' })
    @ApiCreatedResponse()
    @ApiBadRequestResponse({
        description:
            'If the user has already subscribed to this person, then he will be notified with an error message',
    })
    async createFollowing(
        @Param('publisherId') publisherId: number,
        @Req() req: AuthenticatedRequest,
    ): Promise<void> {
        const following = await this.followingService.follow({
            subscriber: req.user.id,
            publisher: publisherId,
        });
        if (!following) {
            throw new BadRequestException('You are already following this person');
        }
    }

    @Delete('/unfollow/:followingId')
    @ApiParam({ name: 'followingId' })
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async deleteFollowing(
        @Req() req: AuthenticatedRequest,
        @Param('followingId') followingId: number,
    ): Promise<void> {
        const follower = await this.followingService.findFollower(followingId);

        if (follower && req.user.id === follower.subscriber) {
            await this.followingService.unfollow(followingId);
        } else {
            throw new BadRequestException('You have no way to unfollow the user');
        }
    }
}
