import { Injectable } from '@nestjs/common';
import {
    IdsForFollowers,
    SubscriberPayload,
    PublisherPayload,
} from 'src/following/interfaces/following.interfaces';
import { FollowingRepository } from 'src/following/dal/following.repository';

@Injectable()
export class FollowingService {
    constructor(private readonly followingRepository: FollowingRepository) {}

    async findFollower(followingId: number) {
        return await this.followingRepository.findFollower(followingId);
    }

    async findPublishers(userId: number): Promise<PublisherPayload[]> {
        return await this.followingRepository.findPublishers(userId);
    }

    async findSubscribers(userId: number): Promise<SubscriberPayload[]> {
        return await this.followingRepository.findSubscribers(userId);
    }

    async follow(idsForFollowers: IdsForFollowers): Promise<boolean> {
        const followers = await this.followingRepository.findFollowers(idsForFollowers);

        if (followers.length === 0) {
            await this.followingRepository.create(idsForFollowers);
            return true;
        } else {
            return false;
        }
    }

    async unfollow(followingId: number): Promise<void> {
        await this.followingRepository.delete(followingId);
    }
}
