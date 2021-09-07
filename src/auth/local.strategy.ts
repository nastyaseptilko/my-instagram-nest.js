import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { User } from '../user/interfaces/user.interfaces';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'email', passwordField: 'password' }); //config
    }

    async validate(email: string, password: string): Promise<User> {
        const user = await this.authService.validateUser({ email, password });

        // serializeUser() автоматически вызывается Nest с user объектом
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
