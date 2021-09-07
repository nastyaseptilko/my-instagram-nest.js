import { ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { SearchService } from './search.service';
import { Response } from 'express';
import { User } from 'src/user/interfaces/user.interfaces';
import { AuthenticatedRequest } from 'src/auth/interfaces/auth.middleware.interfaces';
import { toPresentation } from '../presentation.response';

@ApiTags('Search source')
@Controller('/api')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get('/search')
    @ApiQuery({ name: 'search' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getSearch(
        @Query('search') search: string,
        @Req() req: AuthenticatedRequest,
    ): Promise<User[]> {
        return await this.searchService.findUsers(search, req.user.id);
    }
}
