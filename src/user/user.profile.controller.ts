import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Put,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PhotoService } from 'src/photo/photo.service';
import { AuthenticatedRequest } from 'src/auth/interfaces/auth.middleware.interfaces';
import { Response } from 'express';
import { UpdateUserDto } from 'src/user/dto/update.user.dto';
import { FollowingService } from 'src/following/following.service';
import { toPresentation } from 'src/presentation.response';
import { AuthenticatedGuard } from '../auth/common/guards/authenticated.guard';

@ApiTags('Profile')
@Controller('/api')
export class UserProfileController {
    constructor(
        private readonly userService: UserService,
        private readonly photoService: PhotoService,
        private readonly followingService: FollowingService,
    ) {}

    @UseGuards(AuthenticatedGuard)
    @Get('/profile/:userId?')
    @ApiParam({ name: 'userId' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getProfilePage(
        @Req() req: AuthenticatedRequest,
        @Res() res: Response,
        @Param('userId') userId?: number,
    ): Promise<void> {
        const targetUserId = userId || req.user.id;
        const user = await this.userService.findUser(targetUserId);
        const publishers = await this.followingService.findPublishers(req.user.id);
        const subscribers = await this.followingService.findSubscribers(req.user.id);

        if (user) {
            const photos = await this.photoService.findPhotos(targetUserId);
            const renderOptions = {
                title: 'Profile',
                layout: 'profile',
                user: user,
                isOwnProfile: req.user.id === targetUserId,
                isAllowedToGoToProfile: false,
                isAllowViewLikesCountAndComments: true,
                publishers,
                subscribers,
                message: '',
                photos,
            };
            if (!photos) {
                renderOptions.message = 'You do not have photos';
            }
            return toPresentation({
                req,
                res,
                data: {
                    user: user,
                    isOwnProfile: req.user.id === targetUserId,
                    isAllowedToGoToProfile: false,
                    isAllowViewLikesCountAndComments: true,
                    publishers,
                    subscribers,
                    message: '',
                    photos,
                },
                render: {
                    viewName: 'profile',
                    options: renderOptions,
                },
            });
        } else {
            throw new NotFoundException('User does not exist');
        }
    }

    @UseGuards(AuthenticatedGuard)
    @Put('/profile/:userId')
    @ApiParam({ name: 'userId' })
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async updateUser(
        @Req() req: AuthenticatedRequest,
        @Body() updateUserDto: UpdateUserDto,
        @Param('userId') userId: number,
    ) {
        if (req.user.id === userId) {
            await this.userService.update(userId, updateUserDto);
        } else {
            throw new BadRequestException('You have no way to update user profile');
        }
    }
}
