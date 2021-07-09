import { Controller, Get, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';
import { toPresentation } from 'src/presentation.response';
import { AuthenticatedRequest } from 'src/auth/interfaces/auth.middleware.interfaces';
import { AuthenticatedGuard } from '../auth/common/guards/authenticated.guard';
import { AuthExceptionFilter } from '../auth/common/filters/auth.exceptions.filter';

@Controller('/')
@UseFilters(AuthExceptionFilter)
export class HomeController {
    @UseGuards(AuthenticatedGuard)
    @Get('/home')
    async getPageMain(@Req() req: Request, @Res() res: Response) {
        const user = { user: req.user };
        console.log(user, 'USER!');
        return toPresentation({
            req,
            res,
            render: {
                viewName: 'home',
                options: {
                    title: 'Instagram',
                    layout: 'home',
                },
            },
        });
    }
}
