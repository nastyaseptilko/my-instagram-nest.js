import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../../repositories/users.entity';
import { PhotosEntity } from '../../repositories/photos.entity';
import { FollowingEntity } from '../../repositories/following.entity';
import { CommentsEntity } from '../../repositories/comments.entity';
import { LikesEntity } from '../../repositories/likes.entity';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'express-handlebars';
import { join } from 'path';
import * as session from 'express-session';
import { AuthenticatedRequest } from '../../middlewares/interfaces/auth.middleware.interfaces';
import { NextFunction, Response } from 'express';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user.service';
import { PhotoService } from '../../photo/photo.service';
import { FollowingService } from '../../following/following.service';
import { UserModule } from '../user.module';
import { UserController } from '../user.controller';
import { UserProfileController } from '../user.profile.controller';
import * as request from 'supertest';

describe('User profile', () => {
    let app: NestExpressApplication;
    let token: string;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env',
                }),
                TypeOrmModule.forFeature([UsersEntity, PhotosEntity, FollowingEntity]),
                UserModule,
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
            providers: [UserService, PhotoService, FollowingService],
            controllers: [UserController, UserProfileController],
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

    it(`GET user profile if the user found`, async () => {
        const result = await request(app.getHttpServer())
            .get('/api/profile/1')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(200);
        expect(result.type).toBe('text/html');
    });

    it(`GET user profile if user navigates to their profile`, async () => {
        const result = await request(app.getHttpServer())
            .get('/api/profile')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(200);
        expect(result.type).toBe('text/html');
    });

    it(`GET user profile if the user does not exist`, async () => {
        const result = await request(app.getHttpServer())
            .get('/api/profile/99999999')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(404);
        expect(result.type).toBe('application/json');
        expect(result.body).toEqual({
            error: 'Not Found',
            message: 'User does not exist',
            statusCode: 404,
        });
    });

    it(`PUT user profile`, async () => {
        const result = await request(app.getHttpServer())
            .put('/api/profile/1')
            .send({
                name: 'Test',
                userName: 'testing23',
                webSite: 'https://jestjs.io/',
                bio: 'Hello test case',
            })
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(200);
    });

    it(`PUT user profile. Expected status 404 not found user`, async () => {
        const result = await request(app.getHttpServer())
            .put('/api/profile/9999999')
            .send({
                name: 'Test',
                userName: 'testing23',
            })
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(404);
        expect(result.body).toEqual({
            error: 'Not Found',
            message: 'The user does not exist',
            statusCode: 404,
        });
    });
});
