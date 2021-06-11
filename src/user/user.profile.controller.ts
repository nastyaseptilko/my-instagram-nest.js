import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, NotFoundException, Param, Put, Req, Res } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PhotoService } from 'src/photo/photo.service';
import { AuthenticatedRequest } from 'src/middlewares/interfaces/auth.middleware.interfaces';
import { Response } from 'express';
import { UpdateUserDto } from 'src/user/dto/update.user.dto';

@ApiTags('Profile')
@Controller('/api')
export class UserProfileController {
    constructor(
        private readonly userService: UserService,
        private readonly photoService: PhotoService,
    ) {}

    @Get('/profile/:userId?')
    @ApiParam({ name: 'userId' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getProfile(
        @Req() req: AuthenticatedRequest,
        @Res() res: Response,
        @Param('userId') userId?: number,
    ): Promise<void> {
        const targetUserId = userId || req.user.id;
        const user = await this.userService.findOne(targetUserId);
        if (user) {
            const photos = await this.photoService.findAll(targetUserId);
            const renderOptions = {
                title: 'Profile',
                layout: 'profile',
                user: user,
                allowEdit: req.user.id === targetUserId,
                allowViewPublishers: false,
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
    @ApiNotFoundResponse()
    async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('userId') userId: number) {
        const user = await this.userService.update(userId, updateUserDto);
        if (!user) {
            throw new NotFoundException('The user does not exist!');
        }
        return user;
    }
}
