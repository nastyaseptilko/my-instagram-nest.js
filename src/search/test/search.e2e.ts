import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosEntity } from 'src/repositories/photos.entity';
import { UsersEntity } from 'src/repositories/users.entity';
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
import * as request from 'supertest';
import { SearchService } from 'src/search/search.service';
import { SearchController } from 'src/search/search.controller';
import { SearchModule } from 'src/search/search.module';
import { Repository } from 'typeorm';

describe('Search', () => {
    let app: NestExpressApplication;
    let token: string;
    let userRepository: Repository<UsersEntity>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env',
                }),
                TypeOrmModule.forFeature([UsersEntity]),
                SearchModule,
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
            providers: [SearchService],
            controllers: [SearchController],
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
            {
                id: 2,
                name: 'Test_2',
                userName: 'test_2',
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

    it(`GET search result`, async () => {
        const result = await request(app.getHttpServer())
            .get('/api/search?search=test')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(200);
        expect(result.type).toBe('application/json');
        expect(result.body).toEqual([
            {
                id: 2,
                name: 'Test_2',
                userName: 'test_2',
                webSite: 'none',
                bio: 'I am test',
                email: 'test2@test.com',
                password: 'testing123',
            },
        ]);
    });

    it(`GET empty array search result`, async () => {
        const result = await request(app.getHttpServer())
            .get('/api/search?search=invalidData')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(200);
        expect(result.type).toBe('application/json');
        expect(result.body).toEqual([]);
    });
});
