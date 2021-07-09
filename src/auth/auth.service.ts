import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/interfaces/user.interfaces';
import * as bcrypt from 'bcrypt';
import { EmailAndPasswordUser } from 'src/auth/interfaces/auth.interfaces';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        return await bcrypt.hash(password as string, salt);
    }

    async validateUser(emailAndPasswordUser: EmailAndPasswordUser): Promise<User | null> {
        const user: User | undefined = await this.userService.findUserByEmail(
            emailAndPasswordUser.email,
        );

        if (user && user.password) {
            const isMatch: boolean = await bcrypt.compare(
                emailAndPasswordUser.password as string,
                user.password,
            );
            if (isMatch) {
                return user;
            }
        }
        return null;
    }
}
