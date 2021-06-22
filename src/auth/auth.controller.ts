import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { LoginUserDto } from 'src/auth/dto/login.user.dto';
import { User } from 'src/user/interfaces/user.interfaces';
import * as jwt from 'jsonwebtoken';
import { Logger } from 'src/logger/logger.service';

@ApiTags('Auth')
@Controller('/')
export class AuthController {
    constructor(
        private readonly logger: Logger,
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Get('/login')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getPageLogin(@Res() res: Response): Promise<void> {
        res.render('login', {
            title: 'Login',
            layout: 'authorization',
            registerLink: true,
        });
    }

    @Get('/register')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getPageRegister(@Res() res: Response): Promise<void> {
        res.render('register', {
            title: 'Register',
            layout: 'authorization',
            registerLink: false,
        });
    }

    @Get('/logout')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async logout(@Res() res: Response): Promise<void> {
        res.clearCookie('token');
        res.clearCookie('idToken');
        res.clearCookie('userId');
        res.redirect('/login');
    }

    @Post('/login')
    @ApiOperation({
        summary: 'Login to the system.',
        description:
            'Here the function is called to compare passwords, if the passwords do not match, an error message will appear.',
    })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response): Promise<void> {
        const user = await this.authService.verifyPassword(loginUserDto);

        if (user) {
            try {
                const token = await generateAccessToken(
                    { user: user },
                    process.env.JWT_SECRET as jwt.Secret,
                );
                res.cookie('token', token);
            } catch (e) {
                this.logger.error('Generate token error', e.trace);
            } finally {
                res.redirect('/');
            }
        } else {
            res.render('login', {
                title: 'Login',
                layout: 'authorization',
                error: 'Invalid email or password',
            });
        }
    }
}

export function generateAccessToken(user: { user?: User }, secret: jwt.Secret): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(user, secret, (err, token) => {
            if (token) resolve(token);
            else reject(err);
        });
    });
}
