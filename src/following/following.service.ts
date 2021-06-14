import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowingEntity } from 'src/repositories/following.entity';
import { Repository } from 'typeorm';
import {
    FollowingAndUserFieldsFromDatabase,
    PublisherInfo,
} from 'src/following/interfaces/following.interfaces';

@Injectable()
export class FollowingService {
    constructor(
        @InjectRepository(FollowingEntity)
        private readonly followingRepository: Repository<FollowingEntity>,
    ) {}

    async findAllPublishers(userId: number): Promise<PublisherInfo[]> {
        const result = await this.followingRepository
            .createQueryBuilder('following')
            .select()
            .innerJoinAndSelect('users', 'u', 'u.user_id = following.publisher_id')
            .where('following.subscriber_id = :userId', { userId })
            .getRawMany();

        return result.map((el: FollowingAndUserFieldsFromDatabase) => ({
            userNamePublisher: el.u_userName,
            publisherId: el.following_publisher_id,
        }));
    }
}
