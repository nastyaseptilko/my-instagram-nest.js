import { Injectable } from '@nestjs/common';
import { IdsForFollowers, FollowersWithUser } from 'src/following/interfaces/following.interfaces';
import { FollowersAndUserFieldsFromDatabase } from 'src/following/DAL/following.repository.interfaces';
import { FollowingRepository } from 'src/following/DAL/following.repository';

@Injectable()
export class FollowingService {
    constructor(private readonly followingRepository: FollowingRepository) {}

    async findPublishers(userId: number): Promise<FollowersWithUser[]> {
        const publishers = await this.followingRepository.findAllPublishers(userId);

        return publishers.map((el: FollowersAndUserFieldsFromDatabase) => ({
            followingId: el.following_follow_id,
            nicknamePublisher: el.u_nickname,
            publisherId: el.following_publisher_id,
        }));
    }

    async follow(idsForFollowing: IdsForFollowers): Promise<void> {
        const followers = await this.followingRepository.findFollowers(idsForFollowing);

        if (followers.length === 0) {
            await this.followingRepository.create(idsForFollowing);
        } else {
            throw new Error('You are already following this person');
        }
    }

    async unfollow(followingId: number): Promise<void> {
        await this.followingRepository.delete(followingId);
    }
}
