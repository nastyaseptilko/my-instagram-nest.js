import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowingEntity } from 'src/following/dal/following.entity';
import { Repository } from 'typeorm';
import {
    Follower,
    IdsForFollowers,
    PublisherPayload,
    SubscriberPayload,
} from 'src/following/interfaces/following.interfaces';
import { FollowersAndUserFieldsFromDatabase } from 'src/following/dal/following.repository.interfaces';

@Injectable()
export class FollowingRepository {
    constructor(
        @InjectRepository(FollowingEntity)
        private readonly followingRepository: Repository<FollowingEntity>,
    ) {}

    async findFollower(followingId: number): Promise<FollowingEntity | undefined> {
        return await this.followingRepository.findOne({ where: { id: followingId } });
    }

    async findPublishers(userId: number): Promise<PublisherPayload[]> {
        const publishers = await this.followingRepository
            .createQueryBuilder('following')
            .innerJoinAndSelect('users', 'u', 'u.user_id = following.publisher_id')
            .where('following.subscriber_id = :userId', { userId })
            .getRawMany();

        return publishers.map((el: FollowersAndUserFieldsFromDatabase) => ({
            followingId: el.following_follow_id,
            nicknamePublisher: el.u_nickname,
            publisherId: el.following_publisher_id,
        }));
    }

    async findSubscribers(userId: number): Promise<SubscriberPayload[]> {
        const subscribers = await this.followingRepository
            .createQueryBuilder('following')
            .innerJoinAndSelect('users', 'u', 'u.user_id = following.subscriber_id')
            .where('following.publisher_id = :userId', { userId })
            .getRawMany();

        return subscribers.map((subscriber: FollowersAndUserFieldsFromDatabase) => ({
            publisherId: subscriber.following_publisher_id,
            nicknameSubscriber: subscriber.u_nickname,
            subscriberId: subscriber.following_subscriber_id,
        }));
    }

    async findFollowers(idsForFollowers: IdsForFollowers): Promise<Follower[]> {
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
