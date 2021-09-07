import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { UsersEntity } from 'src/user/dal/users.entity';
import { PhotosEntity } from 'src/photo/dal/photos.entity';
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { PhotoService } from 'src/photo/photo.service';
import { PhotoController } from 'src/photo/photo.controller';
import { Repository } from 'typeorm';
import { UserModule } from 'src/user/user.module';
import { PhotoRepository } from 'src/photo/dal/photo.repository';
import { createTestingApplication, createTestingModule } from 'src/app.e2e';

describe('Photo', () => {
    let app: NestExpressApplication;
    let token: string;
    let userRepository: Repository<UsersEntity>;
    let photoRepository: Repository<PhotosEntity>;
    const configService = new ConfigService();

    beforeAll(async () => {
        const module = await createTestingModule(
            [PhotosEntity],
            [UserModule],
            [PhotoRepository, PhotoService],
            [PhotoController],
        );

        app = await createTestingApplication(
            module.createNestApplication<NestExpressApplication>(),
            configService,
        );

        token = jwt.sign({ user: { id: 1 } }, configService.get('JWT_SECRET') as string);

        userRepository = module.get('UsersEntityRepository');
        photoRepository = module.get('PhotosEntityRepository');

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
