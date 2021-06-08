import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    name!: string;

    @IsNotEmpty()
    @ApiProperty()
    userName!: string;

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
