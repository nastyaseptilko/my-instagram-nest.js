import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/user/dal/users.entity';
import { Repository } from 'typeorm';
import { CreateUserPayload, UpdateUserPayload, User } from 'src/user/interfaces/user.interfaces';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UsersEntity)
        private userRepository: Repository<UsersEntity>,
    ) {}

    async findUsersByEmails(emails: string[]): Promise<User[]> {
        return await this.userRepository
            .createQueryBuilder('users')
            .where('users.email IN (:emails)', { emails })
            .getMany();
    }

    async findUser(userId: number): Promise<User | undefined> {
        return await this.userRepository.findOne(userId);
    }

    async findUserByEmail(email: string): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async create(createUser: CreateUserPayload): Promise<void> {
        await this.userRepository.insert(createUser);
    }

    async update(userId: number, updateUser: UpdateUserPayload) {
        return await this.userRepository.update(userId, updateUser);
    }
}
