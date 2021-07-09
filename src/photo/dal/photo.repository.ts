import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotosEntity } from 'src/photo/dal/photos.entity';
import { Repository } from 'typeorm';
import {
    CreatePhotoPayload,
    Photo,
    PhotoUpdatePayload,
    PhotoWithFollowing,
} from 'src/photo/interfaces/photo.interfaces';
import { PhotoAndFollowingFieldsFromDatabase } from 'src/photo/dal/photo.repository.interfaces';

@Injectable()
export class PhotoRepository {
    constructor(
        @InjectRepository(PhotosEntity)
        private photoRepository: Repository<PhotosEntity>,
    ) {}

    async findPhoto(photoId: number): Promise<Photo | undefined> {
        return await this.photoRepository.findOne({ where: { id: photoId } });
    }

    async findPhotos(userId: number): Promise<Photo[]> {
        return await this.photoRepository.find({ where: { userId }, order: { id: 'DESC' } });
    }

    async findPublishersAndPersonalPhotos(userId: number): Promise<PhotoWithFollowing[]> {
        const photos = await this.photoRepository
            .createQueryBuilder('photos')
            .leftJoinAndSelect('following', 'f', 'f.publisher_id = photos.user_id')
            .leftJoinAndSelect('users', 'u', 'u.user_id = photos.user_id')
            .where('photos.user_id = :userId', { userId })
            .orWhere('f.subscriber_id = :userId', { userId })
            .orderBy('photo_id', 'DESC')
            .getRawMany();

        return photos.map((photo: PhotoAndFollowingFieldsFromDatabase) => ({
            photoId: photo.photos_photo_id,
            userId: photo.photos_user_id,
            caption: photo.photos_caption,
            imageUrl: photo.photos_image_url,
            filter: photo.photos_filter,
            nickname: photo.u_nickname,
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
