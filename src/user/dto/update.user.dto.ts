import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty()
    name!: string;

    @ApiProperty()
    userName!: string;

    @ApiProperty()
    webSite!: string;

    @ApiProperty()
    bio!: string;
}
