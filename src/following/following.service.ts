import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowingEntity } from '../repositories/following.entity';
import { Repository } from 'typeorm';
import { Following } from './interfaces/following.interfaces';

@Injectable()
export class FollowingService {
    constructor(
        @InjectRepository(FollowingEntity)
        private readonly followingRepository: Repository<FollowingEntity>,
    ) {}

    async findAllPublishers(userId: number): Promise<Following[]> {
        return await this.followingRepository.find({ where: { subscriber: userId } });
    }
}
