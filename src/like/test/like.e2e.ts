import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { UsersEntity } from 'src/user/dal/users.entity';
import { PhotosEntity } from 'src/photo/dal/photos.entity';
import { LikesEntity } from 'src/like/dal/likes.entity';
import * as jwt from 'jsonwebtoken';
import { LikeService } from 'src/like/like.service';
import { LikeController } from 'src/like/like.controller';
import * as request from 'supertest';
import { LikeRepository } from 'src/like/dal/like.repository';
import { Repository } from 'typeorm';
import { UserModule } from 'src/user/user.module';
import { PhotoModule } from 'src/photo/photo.module';
import { createTestingApplication, createTestingModule } from 'src/app.e2e';

describe('Like', () => {
    let app: NestExpressApplication;
    let token: string;
    let userRepository: Repository<UsersEntity>;
    let photoRepository: Repository<PhotosEntity>;
    let likeRepository: Repository<LikesEntity>;
    const configService = new ConfigService();

    beforeAll(async () => {
        const module = await createTestingModule(
            [LikesEntity],
            [UserModule, PhotoModule],
            [LikeService, LikeRepository],
            [LikeController],
        );

        app = await createTestingApplication(
            module.createNestApplication<NestExpressApplication>(),
            configService,
        );

        token = jwt.sign({ user: { id: 1 } }, configService.get('JWT_SECRET') as string);

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
