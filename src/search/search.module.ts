import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { SearchService } from 'src/search/search.service';
import { SearchController } from 'src/search/search.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity])],
    providers: [SearchService],
    controllers: [SearchController],
})
export class SearchModule {}
