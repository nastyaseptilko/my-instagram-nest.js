import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { PhotoService } from 'src/photo/photo.service';
import { AuthenticatedRequest } from 'src/middlewares/interfaces/auth.middleware.interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { CreatePhotoDto } from 'src/photo/dto/create.photo.dto';

const storage = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const filename: string = uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`);
        },
    }),
};

@ApiTags('Photo')
@Controller('/api')
export class PhotoController {
    constructor(private readonly photoService: PhotoService) {}

    @Get('/photo')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getPagePhoto(@Res() res: Response): Promise<void> {
        res.render('photo', {
            title: 'Photo',
            layout: 'photos',
            viewForm: false,
        });
    }

    @Get('/photos')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getPhotos(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
        const photos = await this.photoService.findAllPhotos(req.user.id);
        res.render('photos', {
            title: 'Photos',
            layout: 'photos',
            photos: photos,
        });
    }

    @Post('/photo/upload')
    @UseInterceptors(FileInterceptor('image', storage))
    async publishPhoto(
        @UploadedFile() file: Express.Multer.File,
        @Body() createPhotoDto: CreatePhotoDto,
        @Req() req: AuthenticatedRequest,
        @Res() res: Response,
    ) {
        if (file) {
            await this.photoService.createPhoto({
                userId: req.user.id,
                imageUrl: `/${file.filename}`,
                filter: createPhotoDto.filter,
                caption: createPhotoDto.caption,
            });
        } else {
            res.render('photo', {
                title: 'Photo',
                layout: 'photos',
                error: 'You did not choose file',
            });
        }
    }
}
