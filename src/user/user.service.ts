import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { Repository } from 'typeorm';
import { CreateUserPayload, UpdateUserPayload, User } from 'src/user/interfaces/user.interfaces';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UsersEntity)
        private usersRepository: Repository<UsersEntity>,
    ) {}

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(userId: number): Promise<User | undefined> {
        return this.usersRepository.findOne(userId);
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        return await this.usersRepository.findOne({ where: { email } });
    }

    async create(createUser: CreateUserPayload): Promise<void> {
        await this.usersRepository.insert(createUser);
    }

    update(userId: string, updateUser: UpdateUserPayload) {
        return this.usersRepository.update(userId, updateUser);
    }
}
