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
import { Response, Request } from 'express';
import { LoginUserDto } from 'src/auth/dto/login.user.dto';
import { Logger } from 'src/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { AuthExceptionFilter } from './common/filters/auth.exceptions.filter';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from './interfaces/auth.middleware.interfaces';
import { toPresentation } from '../presentation.response';

@ApiTags('Auth')
@Controller('/')
@UseFilters(AuthExceptionFilter)
export class AuthController {
    constructor(
        private readonly logger: Logger,
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {}

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
        @Req() req: AuthenticatedRequest,
        @Res() res: Response,
        // @Session() session: any,
    ): Promise<void> {
        console.log(req.user.id, 'id');
        console.log(req.user, 'user');
        // res.redirect('/home');
        return toPresentation({
            req,
            res,
            data: { message: 'Login was successful' },
            render: {
                viewName: 'home',
                options: {
                    title: 'Instagram',
                    layout: 'home',
                },
            },
        });
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
