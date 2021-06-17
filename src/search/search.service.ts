import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { FollowingEntity } from 'src/repositories/following.entity';

@Injectable()
export class SearchService {
    async findUsers(search: string, currentUserId: number) {
        return await getRepository(UsersEntity)
            .createQueryBuilder('users')
            .where('users.userName like :search', { search: `%${search}%` })
            .andWhere('users.user_id != :currentUserId')
            .andWhere(qb => {
                const followingQuery = qb
                    .subQuery()
                    .select('publisher_id')
                    .from(FollowingEntity, 'followings')
                    .where('subscriber_id = :currentUserId')
                    .getQuery();
                return `users.user_id NOT IN ${followingQuery}`;
            })
            .setParameter('currentUserId', currentUserId)
            .getMany();
    }
}
