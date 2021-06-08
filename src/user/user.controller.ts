import { UserService } from './user.service';
import { Body, Controller, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { User } from './interfaces/user.interfaces';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@ApiTags('User')
@Controller('api/')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/users')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getUsers(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Get('/user/:userId')
    @ApiParam({ name: 'userId' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getUser(@Param('userId') userId: number): Promise<User> {
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new NotFoundException('The user does not exist');
        }
        return user;
    }

    @Post('/user')
    @ApiCreatedResponse()
    @ApiNotFoundResponse()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
        return await this.userService.create(createUserDto);
    }

    @Put('/user')
    @ApiQuery({ name: 'userId' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async updateUser(@Body() updateUserDto: UpdateUserDto, @Query('userId') userId: string) {
        const user = await this.userService.update(userId, updateUserDto);
        if (!user) {
            throw new NotFoundException('The user does not exist!');
        }
        return user;
    }
}
