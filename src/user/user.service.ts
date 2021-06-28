import { Injectable } from '@nestjs/common';
import { CreateUserPayload, UpdateUserPayload, User } from 'src/user/interfaces/user.interfaces';
import { UserRepository } from 'src/user/DAL/user.repository';

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async findUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findUsersByEmails(emails: string[]): Promise<User[]> {
        if (emails.length === 0) {
            return [];
        }
        return await this.userRepository.findUsersByEmails(emails);
    }

    async findOne(userId: number): Promise<User | undefined> {
        return await this.userRepository.findOne(userId);
    }

    async findUserByEmail(email: string): Promise<User | undefined> {
        return await this.userRepository.findUserByEmail(email);
    }

    async create(createUser: CreateUserPayload): Promise<void> {
        await this.userRepository.create(createUser);
    }

    async update(userId: number, updateUser: UpdateUserPayload) {
        const updateResult = await this.userRepository.update(userId, updateUser);
        return updateResult.affected !== 0;
    }
}
