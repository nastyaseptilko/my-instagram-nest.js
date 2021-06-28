import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { Repository } from 'typeorm';
import { CreateUserPayload, UpdateUserPayload, User } from 'src/user/interfaces/user.interfaces';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UsersEntity)
        private userRepository: Repository<UsersEntity>,
    ) {}

    async find(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findUsersByEmails(emails: string[]): Promise<User[]> {
        return await this.userRepository
            .createQueryBuilder('users')
            .where('users.email IN (:emails)', { emails })
            .getMany();
    }

    async findOne(userId: number): Promise<User | undefined> {
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
