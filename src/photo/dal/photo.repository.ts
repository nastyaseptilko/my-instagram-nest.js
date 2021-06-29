import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotosEntity } from 'src/repositories/photos.entity';
import { Repository } from 'typeorm';
import {
    CreatePhotoPayload,
    Photo,
    PhotoUpdatePayload,
} from 'src/photo/interfaces/photo.interfaces';
import { PhotoAndFollowingFieldsFromDatabase } from 'src/photo/dal/photo.repository.interfaces';

@Injectable()
export class PhotoRepository {
    constructor(
        @InjectRepository(PhotosEntity)
        private photoRepository: Repository<PhotosEntity>,
    ) {}

    async find(userId: number): Promise<Photo[]> {
        return await this.photoRepository.find({ where: { userId }, order: { id: 'DESC' } });
    }

    async findAllPhotos(userId: number): Promise<PhotoAndFollowingFieldsFromDatabase[]> {
        return await this.photoRepository
            .createQueryBuilder('photos')
            .leftJoinAndSelect('following', 'f', 'f.publisher_id = photos.user_id')
            .leftJoinAndSelect('users', 'u', 'u.user_id = photos.user_id')
            .where('photos.user_id = :userId', { userId })
            .orWhere('f.subscriber_id = :userId', { userId })
            .orderBy('photo_id', 'DESC')
            .getRawMany();
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
