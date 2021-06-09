import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { PhotoService } from './photo.service';
import { AuthenticatedRequest } from '../middlewares/interfaces/auth.middleware.interfaces';

@ApiTags('Photo')
@Controller('/api')
export class PhotoController {
    constructor(private readonly photoService: PhotoService) {}

    @Get('/photos')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getTape(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
        const photos = await this.photoService.findAllPhotos(req.user.id);
        res.render('photos', {
            title: 'Photos',
            layout: 'photos',
            photos: photos,
        });
    }
}
