import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotosEntity } from 'src/repositories/photos.entity';
import {
    CreatePhotoPayload,
    Photo,
    PhotoAndFollowingFieldsFromDatabase,
    PhotoUpdatePayload,
    PhotoWithFollowing,
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

    async findAllPhotos(userId: number): Promise<PhotoWithFollowing[]> {
        const photos = await this.photoRepository
            .createQueryBuilder('photos')
            .leftJoinAndSelect('following', 'f', 'f.publisher_id = photos.user_id')
            .where('photos.user_id = :userId', { userId })
            .orWhere('f.subscriber_id = :userId', { userId })
            .orderBy('photo_id', 'DESC')
            .getRawMany();

        return photos.map((photo: PhotoAndFollowingFieldsFromDatabase) => ({
            photoId: photo.photos_photo_id,
            userId: photo.photos_user_id,
            caption: photo.photos_caption,
            imageUrl: photo.photos_imageUrl,
            filter: photo.photos_filter,
        }));
    }

    async create(createPhotoPayload: CreatePhotoPayload): Promise<void> {
        await this.photoRepository.insert(createPhotoPayload);
    }

    async update(photoId: number, photoUpdatePayload: PhotoUpdatePayload): Promise<void> {
        await this.photoRepository.update(photoId, photoUpdatePayload);
    }

    async delete(photoId: number): Promise<void> {
        await this.photoRepository.delete(photoId);
    }
}
