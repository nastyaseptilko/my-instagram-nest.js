import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentsEntity } from 'src/comment/dal/comments.entity';
import { UsersEntity } from 'src/user/dal/users.entity';
import { UserService } from 'src/user/user.service';
import { CommentService } from 'src/comment/comment.service';
import { CommentController } from 'src/comment/comment.controller';
import { CommentRepository } from 'src/comment/dal/comment.repository';
import { UserRepository } from 'src/user/dal/user.repository';
import { EmailService } from 'src/email/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, CommentsEntity]), ConfigModule],
    providers: [UserRepository, UserService, CommentRepository, CommentService, EmailService],
    controllers: [CommentController],
})
export class CommentModule {}
