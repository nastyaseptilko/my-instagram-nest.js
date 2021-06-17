import { Injectable } from '@nestjs/common';
import { User } from 'src/user/interfaces/user.interfaces';
import { getRepository } from 'typeorm';
import { UsersEntity } from 'src/repositories/users.entity';

@Injectable()
export class SearchService {
    async findUsers(search: string): Promise<User[]> {
        return await getRepository(UsersEntity)
            .createQueryBuilder('users')
            .where('users.userName like :search', { search: `%${search}%` })
            .getMany();
    }
}
