import {
    Body,
    Controller,
    Get,
    Post,
    Render,
    Req,
    Res,
    Session,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { Request } from 'express';
import { LoginUserDto } from 'src/auth/dto/login.user.dto';
import * as jwt from 'jsonwebtoken';
import { Logger } from 'src/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { generateAccessToken } from 'src/auth/auth.middleware';
import { User } from 'src/user/interfaces/user.interfaces';
import { toPresentation } from 'src/presentation.response';
import { AuthenticatedRequest } from 'src/auth/interfaces/auth.middleware.interfaces';
import { LoginGuard } from 'src/auth/common/guards/login.guard';
import { AuthExceptionFilter } from './common/filters/auth.exceptions.filter';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('/')
@UseFilters(AuthExceptionFilter)
export class AuthController {
    constructor(
        private readonly logger: Logger,
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {}

    @Get('/')
    @Render('login')
    index(@Req() req: Request): { message: string[] } {
        return { message: req.flash('loginError') };
    }

    @UseGuards(AuthGuard('local'))
    @Post('/login')
    @ApiOperation({
        summary: 'Login to the system.',
        description:
            'Here the function is called to compare passwords, if the passwords do not match, an error message will appear.',
    })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Req() req: Request,
        @Res() res: Response,
        // @Session() session: any,
    ): Promise<void> {
        res.redirect('/home');
        // return toPresentation({
        //     req,
        //     res,
        //     data: { message: 'Login was successful' },
        //     render: {
        //         viewName: 'home',
        //         options: {
        //             title: 'Instagram',
        //             layout: 'home',
        //         },
        //     },
        // });
        // const user: User | null = await this.authService.validateUser(loginUserDto);
        //
        // if (user) {
        //     return toPresentation({
        //         req,
        //         res,
        //         data: { message: 'Login was successful' },
        //         render: {
        //             viewName: 'home',
        //             options: {
        //                 title: 'Instagram',
        //                 layout: 'homePage',
        //             },
        //         },
        //     });
        //     // try {
        //     //     // const token = await generateAccessToken(
        //     //     //     { user },
        //     //     //     this.configService.get('JWT_SECRET') as jwt.Secret,
        //     //     // );
        //     //     // res.cookie('token', token);
        //     // } catch (e) {
        //     //     // this.logger.error('Generate token error', e.trace);
        //     // } finally {
        //     //     toPresentation({
        //     //         req,
        //     //         res,
        //     //         data: { message: 'Login was successful' },
        //     //         render: {
        //     //             viewName: 'home',
        //     //             options: {
        //     //                 title: 'Instagram',
        //     //                 layout: 'homePage',
        //     //             },
        //     //         },
        //     //     });
        //     // }
        // } else {
        //     toPresentation({
        //         req,
        //         res,
        //         data: { error: 'Invalid email or password' },
        //         render: {
        //             viewName: 'login',
        //             options: {
        //                 title: 'Login',
        //                 layout: 'authorization',
        //                 error: 'Invalid email or password',
        //             },
        //         },
        //     });
        // }
    }
}
