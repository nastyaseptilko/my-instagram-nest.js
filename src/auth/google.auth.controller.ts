import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { GoogleLoginResult } from 'src/auth/interfaces/auth.interfaces';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequestViaGoogle } from 'src/middlewares/interfaces/auth.middleware.interfaces';

@ApiTags('Google auth')
@Controller('/auth/google')
export class GoogleAuthController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(AuthGuard('google'))
    @ApiOkResponse()
    @ApiInternalServerErrorResponse()
    async googleAuth(@Req() req: AuthenticatedRequestViaGoogle, @Res() res: Response) {
        const userProfile = { user: req.user } as GoogleLoginResult;
        const email = req.user.email;
        const nickname = userProfile.user.nickname;
        const idToken = userProfile.user.idToken;

        const user = await this.userService.findUserByEmail(email);
        if (user) {
            res.cookie('userId', user.id);
            res.cookie('idToken', idToken);
            res.redirect('/');
        } else {
            await this.userService.create({
                nickname: nickname,
                email,
            });
            res.redirect('/login');
        }
    }
}
