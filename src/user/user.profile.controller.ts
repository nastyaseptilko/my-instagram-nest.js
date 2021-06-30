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
    Delete,
    Get,
    NotFoundException,
    Param,
    Put,
    Req,
    Res,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PhotoService } from 'src/photo/photo.service';
import { AuthenticatedRequest } from 'src/middlewares/interfaces/auth.middleware.interfaces';
import { Response } from 'express';
import { UpdateUserDto } from 'src/user/dto/update.user.dto';
import { FollowingService } from 'src/following/following.service';

@ApiTags('Profile')
@Controller('/api')
export class UserProfileController {
    constructor(
        private readonly userService: UserService,
        private readonly photoService: PhotoService,
        private readonly followingService: FollowingService,
    ) {}

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
        const user = await this.userService.findOne(targetUserId);
        const publishers = await this.followingService.findPublishers(req.user.id);
        const subscribers = await this.followingService.findSubscribers(req.user.id);

        if (user) {
            const photos = await this.photoService.findAll(targetUserId);
            const renderOptions = {
                title: 'Profile',
                layout: 'profile',
                user: user,
                isOwnProfile: req.user.id === targetUserId,
                isAllowViewPublishers: publishers,
                isProfilePage: true,
                isAllowedToGoToProfile: false,
                isAllowViewSubscribers: subscribers,
                isAllowViewLikesCount: true,
                publishers,
                subscribers,
                message: '',
                photos,
            };
            if (!photos) {
                renderOptions.message = 'You do not have photos';
            }
            res.render('profile', renderOptions);
        } else {
            throw new NotFoundException('User does not exist');
        }
    }

    @Put('/profile/:userId')
    @ApiParam({ name: 'userId' })
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async updateUser(
        @Body() updateUserDto: UpdateUserDto,
        @Param('userId') userId: number,
    ): Promise<void> {
        const updatedUser = await this.userService.update(userId, updateUserDto);
        if (!updatedUser) {
            throw new BadRequestException('User is not updated');
        }
    }

    @Delete('/profile/:userId')
    @ApiParam({ name: 'userId' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async deleteUser(@Param('userId') userId: number, @Res() res: Response) {
        const deletedUser = await this.userService.delete(userId);

        if (deletedUser) {
            res.redirect('/logout', 303);
        } else {
            throw new BadRequestException('User is not deleted');
        }
    }
}
