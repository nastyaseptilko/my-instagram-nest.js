import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosEntity } from 'src/repositories/photos.entity';
import { PhotoService } from 'src/photo/photo.service';
import { PhotoController } from 'src/photo/photo.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PhotosEntity])],
    providers: [PhotoService],
    controllers: [PhotoController],
})
export class PhotoModule {}
