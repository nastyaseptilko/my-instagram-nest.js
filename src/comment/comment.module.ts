import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentsEntity } from 'src/repositories/comments.entity';
import { UsersEntity } from 'src/repositories/users.entity';
import { UserService } from 'src/user/user.service';
import { CommentService } from 'src/comment/comment.service';
import { CommentController } from 'src/comment/comment.controller';
import { CommentRepository } from 'src/comment/dal/comment.repository';
import { UserRepository } from 'src/user/dal/user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, CommentsEntity])],
    providers: [UserRepository, UserService, CommentRepository, CommentService],
    controllers: [CommentController],
})
export class CommentModule {}
