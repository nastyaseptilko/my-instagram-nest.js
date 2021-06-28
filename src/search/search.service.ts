import { Injectable } from '@nestjs/common';
import { SearchRepository } from 'src/search/DAL/search.repository';
import { User } from 'src/user/interfaces/user.interfaces';

@Injectable()
export class SearchService {
    constructor(private readonly searchRepository: SearchRepository) {}

    async findUsers(search: string, currentUserId: number): Promise<User[]> {
        const users = await this.searchRepository.findAllUsers(search, currentUserId);

        if (users.length !== 0) {
            return users;
        } else {
            return [];
        }
    }
}
