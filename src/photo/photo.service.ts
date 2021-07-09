import { Injectable } from '@nestjs/common';
import {
    CreatePhotoPayload,
    Photo,
    PhotoUpdatePayload,
    PhotoWithFollowing,
} from 'src/photo/interfaces/photo.interfaces';
import { PhotoRepository } from 'src/photo/dal/photo.repository';

@Injectable()
export class PhotoService {
    constructor(private photoRepository: PhotoRepository) {}

    async findPhoto(photoId: number): Promise<Photo | undefined> {
        return await this.photoRepository.findPhoto(photoId);
    }

    async findPhotos(userId: number): Promise<Photo[]> {
        return await this.photoRepository.findPhotos(userId);
    }

    async findPublishersAndPersonalPhotos(userId: number): Promise<PhotoWithFollowing[]> {
        return await this.photoRepository.findPublishersAndPersonalPhotos(userId);
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
