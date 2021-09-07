import { NestExpressApplication } from '@nestjs/platform-express';
import { UsersEntity } from 'src/user/dal/users.entity';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { UserRepository } from 'src/user/dal/user.repository';
import { AuthService } from 'src/auth/auth.service';
import { UserModule } from 'src/user/user.module';
import { createTestingApplication, createTestingModule } from 'src/app.e2e';

describe('User', () => {
    let app: NestExpressApplication;
    let userRepository: Repository<UsersEntity>;

    beforeAll(async () => {
        const module = await createTestingModule(
            [UsersEntity],
            [UserModule],
            [UserRepository, AuthService, UserService],
            [UserController],
        );

        app = await createTestingApplication(
            module.createNestApplication<NestExpressApplication>(),
        );

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

    it(`should display login page`, async () => {
        const result = await request(app.getHttpServer()).get('/login');

        expect(result.status).toBe(200);
        expect(result.type).toEqual('text/html');
    });

    it(`GET users`, async () => {
        const result = await request(app.getHttpServer()).get('/users');

        expect(result.status).toBe(200);
        expect(result.type).toBe('application/json');
    });

    it(`GET user`, async () => {
        const result = await request(app.getHttpServer()).get('/user/1');

        expect(result.status).toBe(200);
        expect(result.type).toBe('application/json');
    });

    it(`GET user. Expected status 404 the user does not exist`, async () => {
        const result = await request(app.getHttpServer()).get('/user/9999999');

        expect(result.status).toBe(404);
        expect(result.type).toBe('application/json');
        expect(result.body).toEqual({
            error: 'Not Found',
            message: 'The user does not exist',
            statusCode: 404,
        });
    });

    it(`GET page register`, async () => {
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

    it(`POST register. Expected status 400 on validation error`, async () => {
        const result = await request(app.getHttpServer()).post('/register').send({
            fullName: 'Test',
            webSite: 'test',
            bio: 'test',
            email: 'test@mail.ru',
            password: 'test12345',
        });

        expect(result.status).toBe(400);
        expect(result.body).toEqual({
            error: 'Bad Request',
            message: ['nickname should not be empty'],
            statusCode: 400,
        });
    });

    it(`PUT user`, async () => {
        const result = await request(app.getHttpServer()).put('/user/1').send({
            fullName: 'Test Jest',
            nickname: 'TestTestTest',
            webSite: 'none',
            bio: 'My name is jest',
        });

        expect(result.status).toBe(200);
    });

    it(`PUT photo. Expected status 404 the user does not update`, async () => {
        const result = await request(app.getHttpServer()).put('/user/9999999').send({
            fullName: 'Test Jest',
        });

        expect(result.status).toBe(404);
        expect(result.body).toEqual({
            error: 'Not Found',
            message: 'The user does not update',
            statusCode: 404,
        });
    });
});
