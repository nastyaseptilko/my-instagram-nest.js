import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { Repository } from 'typeorm';
import { CreateUserPayload, UpdateUserPayload, User } from 'src/user/interfaces/user.interfaces';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UsersEntity)
        private userRepository: Repository<UsersEntity>,
    ) {}

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findAllByEmails(emails: string[]): Promise<User[]> {
        if (emails.length === 0) {
            return [];
        }
        return await this.userRepository
            .createQueryBuilder('users')
            .where('users.email IN (:emails)', { emails })
            .getMany();
    }

    async findOne(userId: number): Promise<User | undefined> {
        return await this.userRepository.findOne(userId);
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async create(createUser: CreateUserPayload): Promise<void> {
        await this.userRepository.insert(createUser);
    }

    async update(userId: number, updateUser: UpdateUserPayload) {
        const updateResult = await this.userRepository.update(userId, updateUser);
        return updateResult.affected !== 0;
    }
}
