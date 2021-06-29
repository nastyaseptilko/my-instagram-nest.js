import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'express-handlebars';
import * as session from 'express-session';
import * as request from 'supertest';
import { ValidationPipe } from '@nestjs/common';
import { PhotosEntity } from 'src/repositories/photos.entity';
import { FollowingEntity } from 'src/repositories/following.entity';
import { CommentsEntity } from 'src/repositories/comments.entity';
import { LikesEntity } from 'src/repositories/likes.entity';
import { Repository } from 'typeorm';
import { GoogleAuthStrategyService } from 'src/auth/google.auth.strategy.service';
import { GoogleAuthController } from 'src/auth/google.auth.controller';
import { UserRepository } from 'src/user/dal/user.repository';
import { LoggerModule } from 'src/logger/logger.module';

describe('Auth', () => {
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
                AuthModule,
                LoggerModule,
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
            providers: [UserRepository, AuthService, UserService, GoogleAuthStrategyService],
            controllers: [AuthController, GoogleAuthController],
        }).compile();

        app = module.createNestApplication<NestExpressApplication>();
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

        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        userRepository = module.get('UsersEntityRepository');
    });

    afterAll(async () => {
        await userRepository.query(`DELETE FROM users;`);
        await app.close();
    });

    it(`GET page login`, async () => {
        await request(app.getHttpServer())
            .get('/login')
            .set('Accept', 'application/json')
            .expect(200);
    });

    it(`GET logout`, async () => {
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

    it(`POST login`, async () => {
        const result = await request(app.getHttpServer()).post('/login').send({
            email: 'test@mail.ru',
            password: 'test12345',
        });

        expect(result.status).toBe(302);
        expect(result.type).toBe('text/plain');
    });

    it(`POST login. Expected exception invalid email or password`, async () => {
        const result = await request(app.getHttpServer()).post('/login').send({
            email: 'invalidEmai@mail.ru',
            password: '345',
        });

        expect(result.status).toBe(400);
        expect(result.type).toBe('text/html');
    });
});
