import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { Module } from '@nestjs/common';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { GoogleAuthController } from 'src/auth/google.auth.controller';
import { GoogleAuthStrategyService } from 'src/auth/google.auth.strategy.service';
import { LoggerModule } from 'src/logger/logger.module';
import { UserRepository } from 'src/user/dal/user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity]), UserModule, LoggerModule],
    providers: [UserRepository, AuthService, UserService, GoogleAuthStrategyService],
    controllers: [AuthController, GoogleAuthController],
})
export class AuthModule {}
