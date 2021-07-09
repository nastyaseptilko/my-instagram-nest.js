import { NestExpressApplication } from '@nestjs/platform-express';
import { UsersEntity } from 'src/user/dal/users.entity';
import { PhotosEntity } from 'src/photo/dal/photos.entity';
import { LikesEntity } from 'src/like/dal/likes.entity';
import { FollowingEntity } from 'src/following/dal/following.entity';
import { CommentsEntity } from 'src/comment/dal/comments.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/logger/logger.module';
import { ValidationPipe } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'express-handlebars';
import * as session from 'express-session';
import { AuthenticatedRequest } from './auth/interfaces/auth.middleware.interfaces';
import { NextFunction, Response } from 'express';
import { AuthMiddleware } from './auth/auth.middleware';

export async function createTestingModule(
    entities: EntityClassOrSchema[],
    // Did not find defined types for modules and controllers
    modules: Type[],
    providers: Provider[],
    controllers: Type[],
): Promise<TestingModule> {
    return await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot(),
            TypeOrmModule.forFeature(entities),
            ...modules,
            LoggerModule,
            TypeOrmModule.forRoot({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: 'root',
                database: 'instagram_test',
                entities: [UsersEntity, PhotosEntity, FollowingEntity, CommentsEntity, LikesEntity],
                synchronize: true,
            }),
        ],
        providers: providers,
        controllers: controllers,
    }).compile();
}

export async function createTestingApplication(
    app: NestExpressApplication,
    configService?: ConfigService,
): Promise<NestExpressApplication> {
    app.use(cookieParser());

    app.set('view engine', 'hbs');
    app.engine(
        'hbs',
        hbs({
            extname: 'hbs',
            layoutsDir: join(__dirname, '../', 'views/layouts'),
            partialsDir: join(__dirname, '../', 'views/partials'),
        }),
    );

    app.use(
        session({
            secret: configService
                ? (configService.get('JWT_SECRET') as string)
                : (process.env.JWT_SECRET as string),
        }),
    );

    if (configService) {
        app.use('/api', (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
            new AuthMiddleware(configService).use(req, res, next),
        );
    }
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    return app;
}
