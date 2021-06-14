import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotosEntity } from 'src/repositories/photos.entity';
import {
    CreatePhotoPayload,
    Photo,
    PhotoAndFollowingFieldsFromDatabase,
    PhotoInfo,
} from 'src/photo/interfaces/photo.interfaces';

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(PhotosEntity)
        private photoRepository: Repository<PhotosEntity>,
    ) {}

    async findAll(userId: number): Promise<Photo[]> {
        return await this.photoRepository.find({ where: { userId } });
    }

    async findAllPhotos(userId: number): Promise<PhotoInfo[]> {
        const photos = await this.photoRepository
            .createQueryBuilder('photos')
            .select()
            .leftJoinAndSelect('following', 'f', 'f.publisher_id = photos.user_id')
            .where('photos.user_id = :userId', { userId })
            .orWhere('f.subscriber_id = :userId', { userId })
            .orderBy('photo_id', 'DESC')
            .getRawMany();

        return photos.map((p: PhotoAndFollowingFieldsFromDatabase) => ({
            photoId: p.photos_photo_id,
            userId: p.photos_user_id,
            caption: p.photos_caption,
            imageUrl: p.photos_imageUrl,
            filter: p.photos_filter,
        }));
    }

    async createPhoto(createPhoto: CreatePhotoPayload): Promise<void> {
        await this.photoRepository.insert(createPhoto);
    }
}
