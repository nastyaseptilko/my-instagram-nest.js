import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowingEntity } from 'src/repositories/following.entity';
import { Repository } from 'typeorm';
import {
    FollowingAndUserFieldsFromDatabase,
    IdsForFollowing,
    PublisherPayload,
    SubscriberPayload,
} from 'src/following/interfaces/following.interfaces';

@Injectable()
export class FollowingService {
    constructor(
        @InjectRepository(FollowingEntity)
        private readonly followingRepository: Repository<FollowingEntity>,
    ) {}

    async findAllPublishers(userId: number): Promise<PublisherPayload[]> {
        const publishers = await this.followingRepository
            .createQueryBuilder('following')
            .select()
            .innerJoinAndSelect('users', 'u', 'u.user_id = following.publisher_id')
            .where('following.subscriber_id = :userId', { userId })
            .getRawMany();

        return publishers.map((el: FollowingAndUserFieldsFromDatabase) => ({
            followingId: el.following_follow_id,
            userNamePublisher: el.u_userName,
            publisherId: el.following_publisher_id,
        }));
    }

    async findAllSubscribers(userId: number): Promise<SubscriberPayload[]> {
        const subscribers = await this.followingRepository
            .createQueryBuilder('following')
            .innerJoinAndSelect('users', 'u', 'u.user_id = following.subscriber_id')
            .where('following.publisher_id = :userId', { userId })
            .getRawMany();

        return subscribers.map((subscriber: FollowingAndUserFieldsFromDatabase) => ({
            publisherId: subscriber.following_publisher_id,
            userNameSubscriber: subscriber.u_userName,
            subscriberId: subscriber.following_subscriber_id,
        }));
    }

    async follow(idsForFollowing: IdsForFollowing): Promise<void> {
        const following = await this.followingRepository.findOne({
            where: { subscriber: idsForFollowing.subscriber, publisher: idsForFollowing.publisher },
        });
        if (!following) {
            await this.followingRepository.insert(idsForFollowing);
        } else {
            throw new Error('You are already following this person');
        }
    }

    async unfollow(followingId: number): Promise<void> {
        await this.followingRepository.delete(followingId);
    }
}
