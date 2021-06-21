import { Injectable } from '@nestjs/common';
import { SearchRepository } from 'src/search/DAL/search.repository';

@Injectable()
export class SearchService {
    constructor(private readonly searchRepository: SearchRepository) {}

    async findUsers(search: string, currentUserId: number) {
        return await this.searchRepository.findAllUsers(search, currentUserId);
    }
}
