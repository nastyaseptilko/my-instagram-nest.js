import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowingEntity } from 'src/repositories/following.entity';
import { Repository } from 'typeorm';
import { Followers, IdsForFollowers } from 'src/following/interfaces/following.interfaces';
import { FollowersAndUserFieldsFromDatabase } from 'src/following/dal/following.repository.interfaces';

@Injectable()
export class FollowingRepository {
    constructor(
        @InjectRepository(FollowingEntity)
        private readonly followingRepository: Repository<FollowingEntity>,
    ) {}

    async findPublishers(userId: number): Promise<FollowersAndUserFieldsFromDatabase[]> {
        return await this.followingRepository
            .createQueryBuilder('following')
            .innerJoinAndSelect('users', 'u', 'u.user_id = following.publisher_id')
            .where('following.subscriber_id = :userId', { userId })
            .getRawMany();
    }

    async findSubscribers(userId: number): Promise<FollowersAndUserFieldsFromDatabase[]> {
        return await this.followingRepository
            .createQueryBuilder('following')
            .innerJoinAndSelect('users', 'u', 'u.user_id = following.subscriber_id')
            .where('following.publisher_id = :userId', { userId })
            .getRawMany();
    }

    async findFollowers(idsForFollowers: IdsForFollowers): Promise<Followers[]> {
        return await this.followingRepository.find({
            where: { subscriber: idsForFollowers.subscriber, publisher: idsForFollowers.publisher },
        });
    }

    async create(idsForFollowing: IdsForFollowers): Promise<void> {
        await this.followingRepository.insert(idsForFollowing);
    }

    async delete(followingId: number): Promise<void> {
        await this.followingRepository.delete(followingId);
    }
}
