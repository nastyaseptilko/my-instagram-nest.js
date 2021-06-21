import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentsEntity } from 'src/repositories/comments.entity';
import { UsersEntity } from 'src/repositories/users.entity';
import { UserService } from 'src/user/user.service';
import { CommentService } from 'src/comment/comment.service';
import { CommentController } from 'src/comment/comment.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, CommentsEntity])],
    providers: [UserService, CommentService],
    controllers: [CommentController],
})
export class CommentModule {}
