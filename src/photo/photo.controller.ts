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
            const filename: string =
                path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
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

    // TODO: avoid adding empty photos to db and storage
    @Post('/photo/upload')
    @UseInterceptors(FileInterceptor('image', storage))
    publishPhoto(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreatePhotoDto,
        @Req() req: AuthenticatedRequest,
        @Res() res: Response,
    ) {
        console.log('caption: ' + body.caption);
        console.log('filename: ' + file.filename);
        // TODO: add photo insert
        if (file) {
            res.render('photo', {
                title: 'Photo',
                layout: 'photos',
                viewForm: true,
                imageUrl: `/${file.filename}`,
            });
        } else {
            res.render('photo', {
                title: 'Photo',
                layout: 'photos',
                viewForm: false,
                error: 'You did not choose file',
            });
        }
    }

    // TODO: move photo inserting to the method above
    /*@Post('/photo')
    @ApiCreatedResponse()
    @ApiNotFoundResponse()
    async addPhoto(
        @Req() req: AuthenticatedRequest,
        @Res() res: Response,
        @Body() createPhotoDto: CreatePhotoDto,
    ) {
        /!* After the user has uploaded the photo and clicked on the "Submit" button,
            a form will appear on the client that displays the image and input to describe the image.
            ImageUrl is taken from the src attribute and passed in the body of the request to create a photo.
        *!/

        await this.photoService.createPhoto({
            userId: req.user.id,
            imageUrl: createPhotoDto.imageUrl,
            caption: createPhotoDto.caption,
        });
        res.render('photo', {
            title: 'Photo',
            layout: 'photos',
            viewForm: false,
            message: 'Your photo has been publish',
        });
    }*/
}
