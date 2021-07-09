import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/user/dal/users.entity';
import { Module } from '@nestjs/common';
import { UserProfileController } from 'src/user/user.profile.controller';
import { PhotoService } from 'src/photo/photo.service';
import { PhotosEntity } from 'src/photo/dal/photos.entity';
import { FollowingEntity } from 'src/following/dal/following.entity';
import { FollowingService } from 'src/following/following.service';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/user/dal/user.repository';
import { PhotoRepository } from 'src/photo/dal/photo.repository';
import { FollowingRepository } from 'src/following/dal/following.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, PhotosEntity, FollowingEntity])],
    providers: [
        UserRepository,
        PhotoRepository,
        FollowingRepository,
        UserService,
        AuthService,
        PhotoService,
        FollowingService,
    ],
    controllers: [UserController, UserProfileController],
})
export class UserModule {}
