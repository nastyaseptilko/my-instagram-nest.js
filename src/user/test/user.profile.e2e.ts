import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { PhotosEntity } from 'src/repositories/photos.entity';
import { FollowingEntity } from 'src/repositories/following.entity';
import { CommentsEntity } from 'src/repositories/comments.entity';
import { LikesEntity } from 'src/repositories/likes.entity';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'express-handlebars';
import { join } from 'path';
import * as session from 'express-session';
import { AuthenticatedRequest } from 'src/middlewares/interfaces/auth.middleware.interfaces';
import { NextFunction, Response } from 'express';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { UserRepository } from 'src/user/dal/user.repository';
import { PhotoRepository } from 'src/photo/dal/photo.repository';
import { FollowingRepository } from 'src/following/dal/following.repository';
import { AuthService } from 'src/auth/auth.service';
import { PhotoService } from 'src/photo/photo.service';
import { FollowingService } from 'src/following/following.service';
import { UserProfileController } from 'src/user/user.profile.controller';

describe('User profile', () => {
    let app: NestExpressApplication;
    let token: string;
    let userRepository: Repository<UsersEntity>;
    let photoRepository: Repository<PhotosEntity>;
    let followingRepository: Repository<FollowingEntity>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env',
                }),
                TypeOrmModule.forFeature([UsersEntity, PhotosEntity, FollowingEntity]),
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
            providers: [
                UserRepository,
                PhotoRepository,
                FollowingRepository,
                UserService,
                AuthService,
                PhotoService,
                FollowingService,
            ],
            controllers: [UserProfileController],
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

        userRepository = module.get('UsersEntityRepository');
        photoRepository = module.get('PhotosEntityRepository');
        followingRepository = module.get('FollowingEntityRepository');

        await userRepository.save([
            {
                id: 1,
                fullName: 'Test_1',
                nickname: 'test_1',
                webSite: 'none',
                bio: 'I am test',
                email: 'test1@test.com',
                password: 'testing123',
            },
            {
                id: 2,
                fullName: 'Test_2',
                nickname: 'test_2',
                webSite: 'none',
                bio: 'I am test',
                email: 'test2@test.com',
                password: 'testing123',
            },
        ]);

        await photoRepository.save([
            {
                id: 1,
                userId: 1,
                caption: 'test caption',
                imageUrl: '/1.jpg',
                filter: 'none',
            },
        ]);

        await followingRepository.save([
            {
                id: 1,
                subscriber: 1,
                publisher: 2,
            },
        ]);
    });

    afterAll(async () => {
        await followingRepository.query(`DELETE FROM following;`);
        await photoRepository.query(`DELETE FROM photos;`);
        await userRepository.query(`DELETE FROM users;`);
        await app.close();
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
                fullName: 'Test',
                nickname: 'testing23',
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
                fullName: 'Test',
                nickname: 'testing23',
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
