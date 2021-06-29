import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { FollowingEntity } from 'src/repositories/following.entity';
import { ResultSearchUser } from 'src/search/dal/search.repository.interfaces';

@Injectable()
export class SearchRepository {
    async findAllUsers(search: string, currentUserId: number): Promise<ResultSearchUser[]> {
        return await getRepository(UsersEntity)
            .createQueryBuilder('users')
            .where('users.nickname like :search', { search: `%${search}%` })
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
