import { NestExpressApplication } from '@nestjs/platform-express';
import { UsersEntity } from 'src/user/dal/users.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { GoogleAuthStrategyService } from 'src/auth/google.auth.strategy.service';
import { GoogleAuthController } from 'src/auth/google.auth.controller';
import { UserRepository } from 'src/user/dal/user.repository';
import { createTestingApplication, createTestingModule } from 'src/app.e2e';

describe('E2E: Authentication users', () => {
    let app: NestExpressApplication;
    let userRepository: Repository<UsersEntity>;

    beforeAll(async () => {
        const module = await createTestingModule(
            [UsersEntity],
            [AuthModule, UserModule],
            [UserRepository, AuthService, UserService, GoogleAuthStrategyService],
            [AuthController, GoogleAuthController],
        );

        app = await createTestingApplication(
            module.createNestApplication<NestExpressApplication>(),
        );

        userRepository = module.get('UsersEntityRepository');
    });

    afterAll(async () => {
        await userRepository.query(`DELETE FROM users;`);
        await app.close();
    });

    it(`should register user`, async () => {
        const result = await request(app.getHttpServer()).post('/register').send({
            fullName: 'Test',
            nickname: 'test',
            webSite: 'test',
            bio: 'test',
            email: 'test@mail.ru',
            password: 'test12345',
        });

        expect(result.body).toEqual({
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

    it(`POST login`, async () => {
        const result = await request(app.getHttpServer()).post('/login').send({
            email: 'test@mail.ru',
            password: 'test12345',
        });

        expect(result.status).toBe(302);
        expect(result.type).toBe('text/plain');
    });

    it(`POST login. Expected exception invalid email or password`, async () => {
        const result = await request(app.getHttpServer()).post('/login').send({
            email: 'invalidEmai@mail.ru',
            password: '345',
        });

        expect(result.status).toBe(400);
        expect(result.type).toBe('text/html');
    });
});
