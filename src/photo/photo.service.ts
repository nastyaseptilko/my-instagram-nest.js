import { Injectable } from '@nestjs/common';
import {
    CreatePhotoPayload,
    Photo,
    PhotoUpdatePayload,
    PhotoWithFollowing,
} from 'src/photo/interfaces/photo.interfaces';
import { PhotoAndFollowingFieldsFromDatabase } from 'src/photo/dal/photo.repository.interfaces';
import { PhotoRepository } from 'src/photo/dal/photo.repository';

@Injectable()
export class PhotoService {
    constructor(private photoRepository: PhotoRepository) {}

    async findAll(userId: number): Promise<Photo[]> {
        return await this.photoRepository.find(userId);
    }

    async findAllPhotos(userId: number): Promise<PhotoWithFollowing[]> {
        const photos = await this.photoRepository.findAllPhotos(userId);

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
        await this.photoRepository.create(createPhotoPayload);
    }

    async update(photoId: number, photoUpdatePayload: PhotoUpdatePayload): Promise<void> {
        await this.photoRepository.update(photoId, photoUpdatePayload);
    }

    async delete(photoId: number): Promise<void> {
        await this.photoRepository.delete(photoId);
    }
}
