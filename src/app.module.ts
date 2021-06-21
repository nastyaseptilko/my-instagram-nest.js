import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { HomeController } from 'src/home/home.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { PhotoModule } from 'src/photo/photo.module';
import { FollowingModule } from 'src/following/following.module';
import { SearchModule } from 'src/search/search.module';
import { CommentModule } from 'src/comment/comment.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot(),
        LoggerModule,
        UserModule,
        AuthModule,
        PhotoModule,
        FollowingModule,
        SearchModule,
        CommentModule,
    ],
    controllers: [HomeController],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes({ path: '/api', method: RequestMethod.ALL });
    }
}
