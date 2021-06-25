import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { CommentsEntity } from 'src/repositories/comments.entity';
import { PhotosEntity } from 'src/repositories/photos.entity';
import { FollowingEntity } from 'src/repositories/following.entity';
import { LikesEntity } from 'src/repositories/likes.entity';
import * as hbs from 'express-handlebars';
import { join } from 'path';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import * as jwt from 'jsonwebtoken';
import { FollowingModule } from 'src/following/following.module';
import { FollowingService } from 'src/following/following.service';
import { FollowingController } from 'src/following/following.controller';
import * as request from 'supertest';
import { AuthenticatedRequest } from 'src/middlewares/interfaces/auth.middleware.interfaces';
import { NextFunction, Response } from 'express';

describe('Following', () => {
    let app: NestExpressApplication;
    let token: string;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env',
                }),
                TypeOrmModule.forFeature([FollowingEntity]),
                FollowingModule,
                TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: 'localhost',
                    port: 3306,
                    username: 'root',
                    password: 'root',
                    database: 'instagram_test',
                    entities: [
                        UsersEntity,
                        PhotosEntity,
                        FollowingEntity,
                        CommentsEntity,
                        LikesEntity,
                    ],
                    synchronize: true,
                }),
            ],
            providers: [FollowingService],
            controllers: [FollowingController],
        }).compile();
        app = module.createNestApplication<NestExpressApplication>();

        app.useGlobalPipes(new ValidationPipe());
        app.use(cookieParser());

        app.set('view engine', 'hbs');
        app.engine(
            'hbs',
            hbs({
                extname: 'hbs',
                layoutsDir: join(__dirname, '../../../', 'views/layouts'),
                partialsDir: join(__dirname, '../../../', 'views/partials'),
            }),
        );
        app.use(session({ secret: process.env.JWT_SECRET as string }));

        app.use('/api', (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
            new AuthMiddleware().use(req, res, next),
        );

        await app.init();

        token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET as string);
    });

    it(`POST follow`, async () => {
        const result = await request(app.getHttpServer())
            .post('/api/follow/2')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(201);
    });

    it(`DELETE unfollow`, async () => {
        const result = await request(app.getHttpServer())
            .delete('/api/unfollow/1')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(200);
    });
});
