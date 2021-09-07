import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { UsersEntity } from 'src/user/dal/users.entity';
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { SearchService } from 'src/search/search.service';
import { SearchController } from 'src/search/search.controller';
import { SearchModule } from 'src/search/search.module';
import { Repository } from 'typeorm';
import { SearchRepository } from 'src/search/dal/search.repository';
import { createTestingApplication, createTestingModule } from 'src/app.e2e';

describe('Search', () => {
    let app: NestExpressApplication;
    let token: string;
    let userRepository: Repository<UsersEntity>;
    const configService = new ConfigService();

    beforeAll(async () => {
        const module = await createTestingModule(
            [UsersEntity],
            [SearchModule],
            [SearchRepository, SearchService],
            [SearchController],
        );

        app = await createTestingApplication(
            module.createNestApplication<NestExpressApplication>(),
            configService,
        );

        token = jwt.sign({ user: { id: 1 } }, configService.get('JWT_SECRET') as string);

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
                fullName: 'Test_2',
                nickname: 'test_2',
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
