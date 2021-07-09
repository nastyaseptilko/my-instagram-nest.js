import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/user/interfaces/user.interfaces';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    serializeUser(user: User, done: (err: Error | null, user: User) => void): any {
        done(null, user);
    }

    deserializeUser(payload: any, done: (err: Error | null, payload: string) => void): any {
        done(null, payload);
    }
}
