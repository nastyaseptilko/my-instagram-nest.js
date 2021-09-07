import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/user/dal/users.entity';
import { Module } from '@nestjs/common';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { GoogleAuthController } from 'src/auth/google.auth.controller';
import { GoogleAuthStrategyService } from 'src/auth/google.auth.strategy.service';
import { LoggerModule } from 'src/logger/logger.module';
import { UserRepository } from 'src/user/dal/user.repository';
import { ConfigModule } from '@nestjs/config';
import { SessionSerializer } from 'src/auth/session.serializer';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersEntity]),
        ConfigModule,
        UserModule,
        LoggerModule,
        PassportModule.register({ session: true }),
    ],
    providers: [
        UserRepository,
        AuthService,
        UserService,
        GoogleAuthStrategyService,
        LocalStrategy,
        SessionSerializer,
    ],
    controllers: [AuthController, GoogleAuthController],
})
export class AuthModule {}
