import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { SearchService } from 'src/search/search.service';
import { SearchController } from 'src/search/search.controller';
import { SearchRepository } from 'src/search/DAL/search.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity])],
    providers: [SearchRepository, SearchService],
    controllers: [SearchController],
})
export class SearchModule {}
