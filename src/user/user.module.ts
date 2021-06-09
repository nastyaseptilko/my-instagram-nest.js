import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { Module } from '@nestjs/common';
import { UserProfileController } from 'src/user/user.profile.controller';
import { PhotoService } from 'src/photo/photo.service';
import { PhotosEntity } from 'src/repositories/photos.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, PhotosEntity])],
    providers: [UserService, PhotoService],
    controllers: [UserController, UserProfileController],
})
export class UserModule {}
