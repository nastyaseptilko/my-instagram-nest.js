import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { UsersEntity } from 'src/user/dal/users.entity';
import { PhotosEntity } from 'src/photo/dal/photos.entity';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { CommentsEntity } from 'src/comment/dal/comments.entity';
import { CommentController } from 'src/comment/comment.controller';
import { CommentService } from 'src/comment/comment.service';
import { Repository } from 'typeorm';
import { PhotoModule } from 'src/photo/photo.module';
import { UserRepository } from 'src/user/dal/user.repository';
import { CommentRepository } from 'src/comment/dal/comment.repository';
import { createTestingApplication, createTestingModule } from 'src/app.e2e';
import { EmailService } from 'src/email/email.service';

describe('Comment', () => {
    let app: NestExpressApplication;
    let token: string;
    let userRepository: Repository<UsersEntity>;
    let photoRepository: Repository<PhotosEntity>;
    let commentRepository: Repository<CommentsEntity>;
    const configService = new ConfigService();

    beforeAll(async () => {
        const module = await createTestingModule(
            [UsersEntity, CommentsEntity],
            [PhotoModule],
            [UserRepository, UserService, CommentRepository, EmailService, CommentService],
            [CommentController],
        );

        app = await createTestingApplication(
            module.createNestApplication<NestExpressApplication>(),
            configService,
        );

        token = jwt.sign({ user: { id: 1 } }, configService.get('JWT_SECRET') as string);

        userRepository = module.get('UsersEntityRepository');
        photoRepository = module.get('PhotosEntityRepository');
        commentRepository = module.get('CommentsEntityRepository');

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

        await commentRepository.save([
            {
                id: 1,
                text: 'test comment',
                userId: 1,
                photoId: 1,
            },
        ]);
    });

    afterAll(async () => {
        await commentRepository.query(`DELETE FROM comments;`);
        await photoRepository.query(`DELETE FROM photos;`);
        await userRepository.query(`DELETE FROM users;`);
        await app.close();
    });

    it(`GET comments`, async () => {
        const result = await request(app.getHttpServer())
            .get('/api/comment/1')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(200);
        expect(result.type).toBe('text/html');
    });

    it(`POST comment`, async () => {
        const result = await request(app.getHttpServer())
            .post('/api/comment/1')
            .send({ text: 'text text text' })
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(201);
    });

    it(`POST comment. Expected status 400 on validation error `, async () => {
        const result = await request(app.getHttpServer())
            .post('/api/comment/1')
            .send({ text: 123456789 })
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(400);
        expect(result.body).toEqual({
            statusCode: 400,
            message: ['text must be a string'],
            error: 'Bad Request',
        });
        expect(result.type).toBe('application/json');
    });

    it(`PUT comment`, async () => {
        const result = await request(app.getHttpServer())
            .put('/api/comment/1')
            .send({
                text: 'Test',
            })
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(200);
    });

    it(`PUT comment. Expected status 400 on validation error`, async () => {
        const result = await request(app.getHttpServer())
            .put('/api/comment/1')
            .send({
                text: 1234567,
            })
            .set('Cookie', `token=${token};`);

        expect(result.status).toBe(400);
        expect(result.body).toEqual({
            error: 'Bad Request',
            message: ['text must be a string'],
            statusCode: 400,
        });
    });

    it(`DELETE comment`, async () => {
        const result = await request(app.getHttpServer())
            .delete('/api/comment/3')
            .set('Cookie', `token=${token};`)
            .send();

        expect(result.status).toBe(200);
    });
});
