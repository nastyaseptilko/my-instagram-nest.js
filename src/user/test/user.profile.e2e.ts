import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { UsersEntity } from 'src/user/dal/users.entity';
import { PhotosEntity } from 'src/photo/dal/photos.entity';
import { FollowingEntity } from 'src/following/dal/following.entity';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { UserRepository } from 'src/user/dal/user.repository';
import { PhotoRepository } from 'src/photo/dal/photo.repository';
import { FollowingRepository } from 'src/following/dal/following.repository';
import { PhotoService } from 'src/photo/photo.service';
import { FollowingService } from 'src/following/following.service';
import { UserProfileController } from 'src/user/user.profile.controller';
import { createTestingApplication, createTestingModule } from 'src/app.e2e';
import { UserModule } from 'src/user/user.module';

describe('User profile', () => {
    let app: NestExpressApplication;
    let token: string;
    let userRepository: Repository<UsersEntity>;
    let photoRepository: Repository<PhotosEntity>;
    let followingRepository: Repository<FollowingEntity>;
    const configService = new ConfigService();

    beforeAll(async () => {
        const module = await createTestingModule(
            [UsersEntity, PhotosEntity, FollowingEntity],
            [UserModule],
            [
                UserRepository,
                PhotoRepository,
                FollowingRepository,
                UserService,
                PhotoService,
                FollowingService,
            ],
            [UserProfileController],
        );

        app = await createTestingApplication(
            module.createNestApplication<NestExpressApplication>(),
            configService,
        );

        token = jwt.sign({ user: { id: 1 } }, configService.get('JWT_SECRET') as string);

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
