import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { PhotosEntity } from 'src/repositories/photos.entity';
import { FollowingEntity } from 'src/repositories/following.entity';
import { UserService } from 'src/user/user.service';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'express-handlebars';
import { join } from 'path';
import * as jwt from 'jsonwebtoken';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import * as request from 'supertest';
import { CommentsEntity } from 'src/repositories/comments.entity';
import { CommentController } from 'src/comment/comment.controller';
import { CommentService } from 'src/comment/comment.service';
import { CommentModule } from 'src/comment/comment.module';
import { LikesEntity } from 'src/repositories/likes.entity';
import { AuthenticatedRequest } from 'src/middlewares/interfaces/auth.middleware.interfaces';
import { NextFunction, Response } from 'express';

describe('Comment', () => {
    let app: NestExpressApplication;
    let token: string;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env',
                }),
                TypeOrmModule.forFeature([UsersEntity, CommentsEntity]),
                CommentModule,
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
            providers: [ConfigService, UserService, CommentService],
            controllers: [CommentController],
        }).compile();
        app = module.createNestApplication<NestExpressApplication>();

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
        app.use(cookieParser());
        app.use('/api', (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
            new AuthMiddleware().use(req, res, next),
        );

        await app.init();

        token = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET as string);
    });

    it(`GET comments`, async () => {
        const result = await request(app.getHttpServer())
            .get('/api/comment/1')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(200);
        expect(result.type).toBe('text/html');
    });

    it(`POST comment`, async () => {
        const result = await request(app.getHttpServer())
            .post('/api/comment/1')
            .send({ text: 'text text text' })
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(201);
    });

    it(`POST comment. Expected status 400 on validation error `, async () => {
        const result = await request(app.getHttpServer())
            .post('/api/comment/1')
            .send({ text: 123456789 })
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(400);
        expect(result.body).toEqual({
            statusCode: 400,
            message: ['text must be a string'],
            error: 'Bad Request',
        });
        expect(result.type).toBe('application/json');
    });

    it(`PUT comment`, async () => {
        const result = await request(app.getHttpServer())
            .put('/api/comment/1')
            .send({
                text: 'Test',
            })
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(200);
    });

    it(`PUT comment. Expected status 400 on validation error`, async () => {
        const result = await request(app.getHttpServer())
            .put('/api/comment/1')
            .send({
                text: 1234567,
            })
            .set('Cookie', `token=${token};`);

        console.log(result.body, 'result.body');
        expect(result.status).toBe(400);
        expect(result.body).toEqual({
            error: 'Bad Request',
            message: ['text must be a string'],
            statusCode: 400,
        });
    });

    it(`DELETE comment`, async () => {
        const result = await request(app.getHttpServer())
            .delete('/api/comment/3')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(200);
    });
});
