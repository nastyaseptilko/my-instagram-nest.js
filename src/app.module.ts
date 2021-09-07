import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { PhotoModule } from 'src/photo/photo.module';
import { FollowingModule } from 'src/following/following.module';
import { SearchModule } from 'src/search/search.module';
import { CommentModule } from 'src/comment/comment.module';
import { LoggerModule } from 'src/logger/logger.module';
import { LikeModule } from 'src/like/like.module';
import { HomeModule } from 'src/home/home.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(),
        HomeModule,
        LoggerModule,
        UserModule,
        AuthModule,
        PhotoModule,
        FollowingModule,
        SearchModule,
        CommentModule,
        LikeModule,
    ],
    controllers: [],
})
export class AppModule {
    // configure(consumer: MiddlewareConsumer) {
    //     consumer.apply(AuthMiddleware).forRoutes({ path: '/api', method: RequestMethod.ALL });
    // }
}
