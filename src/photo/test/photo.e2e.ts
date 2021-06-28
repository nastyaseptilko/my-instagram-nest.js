import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesEntity } from 'src/repositories/likes.entity';
import { UsersEntity } from 'src/repositories/users.entity';
import { PhotosEntity } from 'src/repositories/photos.entity';
import { FollowingEntity } from 'src/repositories/following.entity';
import { CommentsEntity } from 'src/repositories/comments.entity';
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
import { PhotoService } from 'src/photo/photo.service';
import { PhotoController } from 'src/photo/photo.controller';
import { Repository } from 'typeorm';
import { UserModule } from 'src/user/user.module';

describe('Photo', () => {
    let app: NestExpressApplication;
    let token: string;
    let userRepository: Repository<UsersEntity>;
    let photoRepository: Repository<PhotosEntity>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env',
                }),
                TypeOrmModule.forFeature([PhotosEntity]),
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
            providers: [PhotoService],
            controllers: [PhotoController],
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

        await userRepository.save([
            {
                id: 1,
                name: 'Test_1',
                userName: 'test_1',
                webSite: 'none',
                bio: 'I am test',
                email: 'test1@test.com',
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
            {
                id: 2,
                userId: 1,
                caption: 'test caption',
                imageUrl: '/2.jpg',
                filter: 'none',
            },
        ]);
    });

    afterAll(async () => {
        await photoRepository.query(`DELETE FROM photos;`);
        await userRepository.query(`DELETE FROM users;`);
        await app.close();
    });

    it(`GET photo`, async () => {
        const result = await request(app.getHttpServer())
            .get('/api/photo')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(200);
        expect(result.type).toBe('text/html');
    });

    it(`GET photos`, async () => {
        const result = await request(app.getHttpServer())
            .get('/api/photos')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(200);
        expect(result.type).toBe('text/html');
    });

    it(`POST publish photo`, async () => {
        const result = await request(app.getHttpServer())
            .post('/api/photo/upload')
            .send({ imageUrl: '/1.jpg', caption: 'test', filter: 'none' })
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(201);
        expect(result.type).toBe('text/html');
    });

    it(`PUT photo`, async () => {
        const result = await request(app.getHttpServer())
            .put('/api/photo/1')
            .send({
                caption: 'Test',
            })
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(200);
    });

    it(`PUT photo. Expected status 400 on validation error`, async () => {
        const result = await request(app.getHttpServer())
            .put('/api/photo/1')
            .send({
                caption: 1234567,
            })
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(400);
        expect(result.body).toEqual({
            error: 'Bad Request',
            message: ['caption must be a string'],
            statusCode: 400,
        });
    });

    it(`DELETE photo`, async () => {
        const result = await request(app.getHttpServer())
            .delete('/api/photo/2')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(200);
    });
});
