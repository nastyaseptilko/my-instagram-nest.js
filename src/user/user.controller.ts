import { UserService } from 'src/user/user.service';
import { Body, Controller, Get, NotFoundException, Param, Post, Put, Res } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/user/interfaces/user.interfaces';
import { CreateUserDto } from 'src/user/dto/create.user.dto';
import { UpdateUserDto } from 'src/user/dto/update.user.dto';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('User')
@Controller('/')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Get('/users')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async getUsers(): Promise<User[]> {
        return await this.userService.findUsers();
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

    @Post('/register')
    @ApiOperation({
        summary: 'Register to the system.',
        description:
            'Here the function first looks for the user by email (the email is taken from the form),' +
            'if such an email already exists in the database, the user will be notified of an error. Email must be unique.',
    })
    @ApiCreatedResponse()
    @ApiNotFoundResponse()
    async register(@Body() createUserDto: CreateUserDto, @Res() res: Response): Promise<void> {
        const user = await this.userService.findUserByEmail(createUserDto.email);

        if (user) {
            res.render('register', {
                title: 'Register',
                layout: 'authorization',
                error: 'This user is already registered',
            });
        } else {
            const hash = await this.authService.hashPassword(createUserDto);
            await this.userService.create({
                fullName: createUserDto.fullName,
                nickname: createUserDto.nickname,
                webSite: createUserDto.webSite,
                bio: createUserDto.bio,
                email: createUserDto.email,
                password: hash,
            });
            res.render('login', {
                title: 'Login',
                layout: 'authorization',
            });
        }
    }

    @Put('/user')
    @ApiParam({ name: 'userId' })
    @ApiOkResponse()
    @ApiNotFoundResponse()
    async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('userId') userId: number) {
        const user = await this.userService.update(userId, updateUserDto);
        if (!user) {
            throw new NotFoundException('The user does not exist!');
        }
        return user;
    }
}
