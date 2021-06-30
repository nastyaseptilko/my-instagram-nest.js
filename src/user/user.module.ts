import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { Module } from '@nestjs/common';
import { UserProfileController } from 'src/user/user.profile.controller';
import { PhotoService } from 'src/photo/photo.service';
import { PhotosEntity } from 'src/repositories/photos.entity';
import { FollowingEntity } from 'src/repositories/following.entity';
import { FollowingService } from 'src/following/following.service';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/user/dal/user.repository';
import { PhotoRepository } from 'src/photo/dal/photo.repository';
import { FollowingRepository } from 'src/following/dal/following.repository';
import { AuthController } from '../auth/auth.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, PhotosEntity, FollowingEntity]), LoggerModule],
    providers: [
        UserRepository,
        PhotoRepository,
        FollowingRepository,
        UserService,
        AuthService,
        PhotoService,
        FollowingService,
    ],
    controllers: [UserController, UserProfileController, AuthController],
})
export class UserModule {}
