import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import {
    AuthenticatedRequestViaGoogle,
    GoogleLoginResult,
} from 'src/auth/interfaces/auth.interfaces';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Google auth controller')
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
        const userName = userProfile.user.userName;
        const idToken = userProfile.user.idToken;

        const user = await this.userService.findOneByEmail(email);
        if (user) {
            res.cookie('userId', user.id);
            res.cookie('idToken', idToken);
            res.redirect('/');
        } else {
            await this.userService.create({
                userName,
                email,
            });
            res.redirect('/login');
        }
    }
}
