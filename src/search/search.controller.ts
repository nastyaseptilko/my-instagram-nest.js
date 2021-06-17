import { ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@ApiTags('Search source')
@Controller('/api')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get('/search')
    @ApiQuery({ name: 'search' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getSearch(@Query('search') search: string) {
        const users = await this.searchService.findUsers(search);
        if (users.length > 0) {
            return users;
        } else {
            throw new NotFoundException('Users do not exist');
        }
    }
}
