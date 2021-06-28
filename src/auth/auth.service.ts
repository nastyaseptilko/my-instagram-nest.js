import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserPayload, User } from 'src/user/interfaces/user.interfaces';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/auth/dto/login.user.dto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async hashPassword(createUserDto: CreateUserPayload): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        return await bcrypt.hash(createUserDto.password, salt);
    }

    async verifyPassword(loginUserDto: LoginUserDto): Promise<User | null> {
        const user = await this.userService.findUserByEmail(loginUserDto.email);

        if (user && user.password) {
            const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
            if (isMatch) {
                return user;
            }
        }
        return null;
    }
}
