import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty()
    fullName!: string;

    @ApiProperty()
    nickname!: string;

    @ApiProperty()
    webSite!: string;

    @ApiProperty()
    bio!: string;
}
