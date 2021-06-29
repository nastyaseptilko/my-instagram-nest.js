import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { PhotosEntity } from 'src/repositories/photos.entity';
import { FollowingEntity } from 'src/repositories/following.entity';
import { CommentsEntity } from 'src/repositories/comments.entity';
import { LikesEntity } from 'src/repositories/likes.entity';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'express-handlebars';
import { join } from 'path';
import * as session from 'express-session';
import { AuthenticatedRequest } from 'src/middlewares/interfaces/auth.middleware.interfaces';
import { NextFunction, Response } from 'express';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { UserRepository } from 'src/user/dal/user.repository';
import { AuthService } from 'src/auth/auth.service';
import { UserModule } from 'src/user/user.module';

describe('User', () => {
    let app: NestExpressApplication;
    let userRepository: Repository<UsersEntity>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env',
                }),
                TypeOrmModule.forFeature([UsersEntity]),
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
            providers: [UserRepository, AuthService, UserService],
            controllers: [UserController],
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

        userRepository = module.get('UsersEntityRepository');

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
    });

    afterAll(async () => {
        await userRepository.query(`DELETE FROM users;`);
        await app.close();
    });

    it(`GET users`, async () => {
        const result = await request(app.getHttpServer()).get('/users');
        // .set('Cookie', `token=${token};`);

        expect(result.status).toBe(200);
        expect(result.type).toBe('application/json');
    });

    it(`GET user`, async () => {
        const result = await request(app.getHttpServer()).get('/user/1');

        expect(result.status).toBe(200);
        expect(result.type).toBe('application/json');
    });

    it(`GET user. Expected status 404 the user does not exist`, async () => {
        const result = await request(app.getHttpServer()).get('/user/9999999');

        expect(result.status).toBe(404);
        expect(result.type).toBe('application/json');
        expect(result.body).toEqual({
            error: 'Not Found',
            message: 'The user does not exist',
            statusCode: 404,
        });
    });

    it(`GET page register`, async () => {
        await request(app.getHttpServer())
            .get('/register')
            .set('Accept', 'application/json')
            .expect(200);
    });

    it(`POST register`, async () => {
        const result = await request(app.getHttpServer()).post('/register').send({
            fullName: 'Test',
            nickname: 'test',
            webSite: 'test',
            bio: 'test',
            email: 'test@mail.ru',
            password: 'test12345',
        });

        expect(result.status).toBe(201);
        expect(result.type).toBe('text/html');
    });

    it(`POST register. Expected status 400 on validation error`, async () => {
        const result = await request(app.getHttpServer()).post('/register').send({
            fullName: 'Test',
            webSite: 'test',
            bio: 'test',
            email: 'test@mail.ru',
            password: 'test12345',
        });

        expect(result.status).toBe(400);
        expect(result.body).toEqual({
            error: 'Bad Request',
            message: ['nickname should not be empty'],
            statusCode: 400,
        });
    });

    it(`PUT user`, async () => {
        const result = await request(app.getHttpServer()).put('/user/1').send({
            fullName: 'Test Jest',
            nickname: 'TestTestTest',
            webSite: 'none',
            bio: 'My name is jest',
        });

        expect(result.status).toBe(200);
    });

    it(`PUT photo. Expected status 404 the user does not update`, async () => {
        const result = await request(app.getHttpServer()).put('/user/9999999').send({
            fullName: 'Test Jest',
        });

        expect(result.status).toBe(404);
        expect(result.body).toEqual({
            error: 'Not Found',
            message: 'The user does not update',
            statusCode: 404,
        });
    });
});
