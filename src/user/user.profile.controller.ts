import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, NotFoundException, Param, Put, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { PhotoService } from '../photo/photo.service';
import { AuthenticatedRequest } from '../middlewares/interfaces/auth.middleware.interfaces';
import { Response } from 'express';
import { UpdateUserDto } from './dto/update.user.dto';

@ApiTags('Profile')
@Controller('/api')
export class UserProfileController {
    constructor(
        private readonly userService: UserService,
        private readonly photoService: PhotoService,
    ) {}

    @Get('/profile')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getProfile(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
        const user = await this.userService.findOne(req.user.id);
        if (user) {
            const photos = await this.photoService.findAll(req.user.id);
            if (!photos) {
                res.render('profile', {
                    title: 'Profile',
                    layout: 'profile',
                    user: user,
                    message: 'You do not have photos',
                });
            }
            res.render('profile', {
                title: 'Profile',
                layout: 'profile',
                user: user,
                photos: photos,
            });
        } else {
            throw new NotFoundException('User does not exist');
        }
    }

    @Put('/profile/:userId')
    @ApiParam({ name: 'userId' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('userId') userId: string) {
        const user = await this.userService.update(userId, updateUserDto);
        if (!user) {
            throw new NotFoundException('The user does not exist!');
        }
        return user;
    }
}
