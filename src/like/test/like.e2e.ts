import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowingEntity } from 'src/repositories/following.entity';
import { UsersEntity } from 'src/repositories/users.entity';
import { PhotosEntity } from 'src/repositories/photos.entity';
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
import { LikeService } from 'src/like/like.service';
import { LikeController } from 'src/like/like.controller';
import * as request from 'supertest';
import { LikeRepository } from 'src/like/dal/like.repository';
import { Repository } from 'typeorm';
import { UserModule } from 'src/user/user.module';
import { PhotoModule } from 'src/photo/photo.module';

describe('Like', () => {
    let app: NestExpressApplication;
    let token: string;
    let userRepository: Repository<UsersEntity>;
    let photoRepository: Repository<PhotosEntity>;
    let likeRepository: Repository<LikesEntity>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env',
                }),
                TypeOrmModule.forFeature([LikesEntity]),
                UserModule,
                PhotoModule,
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
            providers: [LikeService, LikeRepository],
            controllers: [LikeController],
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
        likeRepository = module.get('LikesEntityRepository');

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
    });

    afterAll(async () => {
        await photoRepository.query(`DELETE FROM photos;`);
        await userRepository.query(`DELETE FROM users;`);
        await likeRepository.query(`DELETE FROM likes;`);
        await app.close();
    });

    it(`GET likes`, async () => {
        const result = await request(app.getHttpServer())
            .get('/api/likes/1')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(200);
        expect(result.body).toEqual({ likesCount: '0' });
    });

    it(`POST liked`, async () => {
        const result = await request(app.getHttpServer())
            .post('/api/like')
            .send({ photoId: 1 })
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(201);
        expect(result.body).toEqual({ message: 'Was liked' });
    });

    it(`POST disliked`, async () => {
        const result = await request(app.getHttpServer())
            .post('/api/like')
            .send({ photoId: 1 })
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(201);
        expect(result.body).toEqual({ message: 'Was disliked' });
    });
});
