import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { UsersEntity } from 'src/user/dal/users.entity';
import { FollowingEntity } from 'src/following/dal/following.entity';
import * as jwt from 'jsonwebtoken';
import { FollowingService } from 'src/following/following.service';
import { FollowingController } from 'src/following/following.controller';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { UserModule } from 'src/user/user.module';
import { FollowingRepository } from 'src/following/dal/following.repository';
import { createTestingApplication, createTestingModule } from 'src/app.e2e';

describe('Following', () => {
    let app: NestExpressApplication;
    let token: string;
    let userRepository: Repository<UsersEntity>;
    let followingRepository: Repository<FollowingEntity>;
    const configService = new ConfigService();

    beforeAll(async () => {
        const module = await createTestingModule(
            [FollowingEntity],
            [UserModule],
            [FollowingRepository, FollowingService],
            [FollowingController],
        );

        app = await createTestingApplication(
            module.createNestApplication<NestExpressApplication>(),
            configService,
        );

        token = jwt.sign({ user: { id: 1 } }, configService.get('JWT_SECRET') as string);

        userRepository = module.get('UsersEntityRepository');
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
            {
                id: 3,
                fullName: 'Test_3',
                nickname: 'test_3',
                webSite: 'none',
                bio: 'I am test',
                email: 'test3@test.com',
                password: 'testing123',
            },
        ]);

        await followingRepository.save([
            {
                id: 1,
                subscriber: 1,
                publisher: 3,
            },
        ]);
    });

    afterAll(async () => {
        await followingRepository.query(`DELETE FROM following;`);
        await userRepository.query(`DELETE FROM users;`);
        await app.close();
    });

    it(`POST follow`, async () => {
        const result = await request(app.getHttpServer())
            .post('/api/follow/2')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(201);
    });

    it(`DELETE unfollow`, async () => {
        const result = await request(app.getHttpServer())
            .delete('/api/unfollow/1')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(200);
    });
});
