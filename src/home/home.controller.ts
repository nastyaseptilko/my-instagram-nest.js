import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/')
export class HomeController {
    @Get()
    async getPageMain(@Res() response: Response) {
        response.render('home', {
            title: 'Instagram',
            layout: 'homePage',
        });
    }
}
