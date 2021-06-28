import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { PhotosEntity } from 'src/repositories/photos.entity';
import { FollowingEntity } from 'src/repositories/following.entity';
import { UserModule } from 'src/user/user.module';
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
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';

describe('User', () => {
    let app: NestExpressApplication;
    let token: string;

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
            providers: [UserService],
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

        token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET as string);
    });

    it(`GET users`, async () => {
        const result = await request(app.getHttpServer())
            .get('/api/users')
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(200);
        expect(result.type).toBe('application/json');
    });

    it(`GET user`, async () => {
        const result = await request(app.getHttpServer())
            .get('/api/user/1')
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(200);
        expect(result.type).toBe('application/json');
    });

    it(`GET user. Expected status 404 the user does not exist`, async () => {
        const result = await request(app.getHttpServer())
            .get('/api/user/9999999')
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(404);
        expect(result.type).toBe('application/json');
        expect(result.body).toEqual({
            error: 'Not Found',
            message: 'The user does not exist',
            statusCode: 404,
        });
    });

    it(`POST user`, async () => {
        const result = await request(app.getHttpServer())
            .post('/api/user')
            .set('Cookie', `token=${token};`)
            .send({
                name: 'Jest',
                userName: 'jestjestjest',
                webSite: 'none',
                bio: 'My name is jest',
                email: 'testJest@test.com',
                password: 'testing123',
            });

        expect(result.status).toBe(201);
    });

    it(`PUT user`, async () => {
        const result = await request(app.getHttpServer())
            .put('/api/user/1')
            .set('Cookie', `token=${token};`)
            .send({
                name: 'Test Jest',
                userName: 'TestTestTest',
                webSite: 'none',
                bio: 'My name is jest',
            });

        expect(result.status).toBe(200);
    });

    it(`PUT photo. Expected status 404 the user does not update`, async () => {
        const result = await request(app.getHttpServer())
            .put('/api/user/9999999')
            .set('Cookie', `token=${token};`)
            .send({
                name: 'Test Jest',
            });

        expect(result.status).toBe(404);
        expect(result.body).toEqual({
            error: 'Not Found',
            message: 'The user does not update',
            statusCode: 404,
        });
    });
});
