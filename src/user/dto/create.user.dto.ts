import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    fullName!: string;

    @IsNotEmpty()
    @ApiProperty()
    nickname!: string;

    @ApiProperty()
    webSite!: string;

    @ApiProperty()
    bio!: string;

    @ApiProperty()
    @IsEmail()
    email!: string;

    @ApiProperty()
    @IsNotEmpty()
    password!: string;
}
