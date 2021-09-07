import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    Res,
    UploadedFile,
    UseFilters,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { PhotoService } from 'src/photo/photo.service';
import { AuthenticatedRequest } from 'src/auth/interfaces/auth.middleware.interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { CreatePhotoDto } from 'src/photo/dto/create.photo.dto';
import { UpdatePhotoDto } from 'src/photo/dto/update.photo.dto';
import { toPresentation } from '../presentation.response';
import { AuthenticatedGuard } from '../auth/common/guards/authenticated.guard';
import { AuthExceptionFilter } from '../auth/common/filters/auth.exceptions.filter';
import { AuthGuard } from '@nestjs/passport';

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
@UseFilters(AuthExceptionFilter)
export class PhotoController {
    constructor(private readonly photoService: PhotoService) {}

    @UseGuards(AuthenticatedGuard)
    @Get('/photo')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getPagePhoto(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
        return toPresentation({
            req,
            res,
            data: { viewForm: false },
            render: {
                viewName: 'photo',
                options: {
                    title: 'Photo',
                    layout: 'photos',
                    viewForm: false,
                },
            },
        });
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/photos')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getPhotos(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
        const photos = await this.photoService.findPublishersAndPersonalPhotos(req.user.id);
        return toPresentation({
            req,
            res,
            data: {
                photos: photos,
                isAllowedToGoToProfile: true,
                isAllowLiked: true,
            },
            render: {
                viewName: 'photos',
                options: {
                    title: 'Photos',
                    layout: 'photos',
                    photos: photos,
                    isAllowedToGoToProfile: true,
                    isAllowLiked: true,
                },
            },
        });
    }

    @UseGuards(AuthenticatedGuard)
    @Post('/photo/upload')
    @UseInterceptors(FileInterceptor('image', storage))
    @ApiCreatedResponse()
    @ApiNotFoundResponse()
    async publishPhoto(
        @UploadedFile() file: Express.Multer.File,
        @Body() createPhotoDto: CreatePhotoDto,
        @Req() req: AuthenticatedRequest,
        @Res() res: Response,
    ) {
        if (file) {
            await this.photoService.create({
                userId: req.user.id,
                imageUrl: `/${file.filename}`,
                filter: createPhotoDto.filter,
                caption: createPhotoDto.caption,
            });
        } else {
            return toPresentation({
                req,
                res,
                data: { error: 'You did not choose file' },
                render: {
                    viewName: 'photo',
                    options: {
                        title: 'Photo',
                        layout: 'photos',
                        error: 'You did not choose file',
                    },
                },
            });
        }
    }

    @UseGuards(AuthenticatedGuard)
    @Put('photo/:photoId')
    @ApiParam({ name: 'photoId' })
    @ApiOkResponse()
    @ApiBadRequestResponse()
    async updatePhoto(
        @Param('photoId') photoId: number,
        @Req() req: AuthenticatedRequest,
        @Body() updatePhotoDto: UpdatePhotoDto,
    ): Promise<void> {
        const photo = await this.photoService.findPhoto(photoId);

        if (photo && req.user.id === photo.userId) {
            await this.photoService.update(photoId, updatePhotoDto);
        } else {
            throw new BadRequestException('You have no way to update the photo');
        }
    }

    @UseGuards(AuthenticatedGuard)
    @Delete('photo/:photoId')
    @ApiParam({ name: 'photoId' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async deletePhoto(
        @Param('photoId') photoId: number,
        @Req() req: AuthenticatedRequest,
    ): Promise<void> {
        const photo = await this.photoService.findPhoto(photoId);

        if (photo && req.user.id === photo.userId) {
            await this.photoService.delete(photoId);
        } else {
            throw new BadRequestException('You have no way to delete the photo');
        }
    }
}
