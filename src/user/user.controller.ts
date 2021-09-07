import { UserService } from 'src/user/user.service';
import { Body, Controller, Get, Post, Req, Res, UseFilters } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create.user.dto';
import { Response } from 'express';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { toPresentation } from 'src/presentation.response';
import { AuthenticatedRequest } from 'src/auth/interfaces/auth.middleware.interfaces';
import { AuthExceptionFilter } from '../auth/common/filters/auth.exceptions.filter';

@ApiTags('User')
@Controller('/')
@UseFilters(AuthExceptionFilter)
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Get('/login')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getPageLogin(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
        return toPresentation({
            req,
            res,
            data: { registerLink: true },
            render: {
                viewName: 'login',
                options: {
                    title: 'Login',
                    layout: 'authorization',
                    registerLink: true,
                },
            },
        });
    }

    @Post('/logout')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
        // res.clearCookie('token');
        // res.clearCookie('idToken');
        // res.clearCookie('userId');
        // req.session.destroy(() => {
        //     res.cookie(this.config.get("SESSION_NAME"), "", {
        //         domain: this.config.get("SESSION_DOMAIN"),
        //         path: "/",
        //         httpOnly: true,
        //         maxAge: 0,
        //         expires: new Date(0)
        //     })
        //     res.end(),
        // });
        req.logout();
        res.redirect('/login', 303);
    }

    @Get('/register')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getPageRegister(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
        return toPresentation({
            req,
            res,
            data: { registerLink: false },
            render: {
                viewName: 'register',
                options: {
                    title: 'Register',
                    layout: 'authorization',
                    registerLink: false,
                },
            },
        });
    }

    @Post('/register')
    @ApiOperation({
        summary: 'Register to the system.',
        description:
            'Here the function first looks for the user by email (the email is taken from the form),' +
            'if such an email already exists in the database, the user will be notified of an error. Email must be unique.',
    })
    @ApiCreatedResponse()
    @ApiNotFoundResponse()
    async register(
        @Body() createUserDto: CreateUserDto,
        @Req() req: AuthenticatedRequest,
        @Res() res: Response,
    ): Promise<void> {
        const user = await this.userService.findUserByEmail(createUserDto.email);

        if (user) {
            return toPresentation({
                req,
                res,
                data: { error: 'This user is already registered' },
                render: {
                    viewName: 'register',
                    options: {
                        title: 'Register',
                        layout: 'authorization',
                        error: 'This user is already registered',
                    },
                },
            });
        } else {
            const hash = await this.authService.hashPassword(createUserDto.password);
            await this.userService.create({
                fullName: createUserDto.fullName,
                nickname: createUserDto.nickname,
                webSite: createUserDto.webSite,
                bio: createUserDto.bio,
                email: createUserDto.email,
                password: hash,
            });
            return toPresentation({
                req,
                res,
                data: { message: 'Registration completed successfully' },
                render: {
                    viewName: 'login',
                    options: {
                        title: 'Login',
                        layout: 'authorization',
                    },
                },
            });
        }
    }
}
