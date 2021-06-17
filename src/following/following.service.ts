import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowingEntity } from 'src/repositories/following.entity';
import { Repository } from 'typeorm';
import {
    FollowingAndUserFieldsFromDatabase,
    IdsForFollowing,
    FollowingWithUser,
    Following,
} from 'src/following/interfaces/following.interfaces';

@Injectable()
export class FollowingService {
    constructor(
        @InjectRepository(FollowingEntity)
        private readonly followingRepository: Repository<FollowingEntity>,
    ) {}

    async findAllPublishers(userId: number): Promise<FollowingWithUser[]> {
        const result = await this.followingRepository
            .createQueryBuilder('following')
            .select()
            .innerJoinAndSelect('users', 'u', 'u.user_id = following.publisher_id')
            .where('following.subscriber_id = :userId', { userId })
            .getRawMany();

        return result.map((el: FollowingAndUserFieldsFromDatabase) => ({
            followingId: el.following_follow_id,
            userNamePublisher: el.u_userName,
            publisherId: el.following_publisher_id,
        }));
    }

    async follow(idsForFollowing: IdsForFollowing): Promise<void> {
        const following: Following[] = await this.followingRepository.find({
            where: { subscriber: idsForFollowing.subscriber, publisher: idsForFollowing.publisher },
        });
        if (following.length === 0) {
            await this.followingRepository.insert(idsForFollowing);
        } else {
            throw new Error('You are already following this person');
        }
    }

    async unfollow(followingId: number): Promise<void> {
        await this.followingRepository.delete(followingId);
    }
}
