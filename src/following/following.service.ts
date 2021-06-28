import { Injectable } from '@nestjs/common';
import {
    IdsForFollowers,
    SubscriberPayload,
    PublisherPayload,
} from 'src/following/interfaces/following.interfaces';
import { FollowersAndUserFieldsFromDatabase } from 'src/following/DAL/following.repository.interfaces';
import { FollowingRepository } from 'src/following/DAL/following.repository';

@Injectable()
export class FollowingService {
    constructor(private readonly followingRepository: FollowingRepository) {}

    async findPublishers(userId: number): Promise<PublisherPayload[]> {
        const publishers = await this.followingRepository.findPublishers(userId);

        return publishers.map((el: FollowersAndUserFieldsFromDatabase) => ({
            followingId: el.following_follow_id,
            nicknamePublisher: el.u_nickname,
            publisherId: el.following_publisher_id,
        }));
    }

    async findSubscribers(userId: number): Promise<SubscriberPayload[]> {
        const subscribers = await this.followingRepository.findSubscribers(userId);

        return subscribers.map((subscriber: FollowersAndUserFieldsFromDatabase) => ({
            publisherId: subscriber.following_publisher_id,
            nicknameSubscriber: subscriber.u_nickname,
            subscriberId: subscriber.following_subscriber_id,
        }));
    }

    async follow(idsForFollowers: IdsForFollowers): Promise<void> {
        const followers = await this.followingRepository.findFollowers(idsForFollowers);

        if (followers.length === 0) {
            await this.followingRepository.create(idsForFollowers);
        } else {
            throw new Error('You are already following this person');
        }
    }

    async unfollow(followingId: number): Promise<void> {
        await this.followingRepository.delete(followingId);
    }
}
