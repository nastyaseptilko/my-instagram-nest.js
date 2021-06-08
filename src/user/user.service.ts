import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/repositories/user.entity';
import { Repository } from 'typeorm';
import { CreateUserPayload, UpdateUserPayload, User } from 'src/user/interfaces/user.interfaces';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
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
