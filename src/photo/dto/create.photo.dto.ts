import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePhotoDto {
    @ApiProperty()
    @IsString()
    caption!: string;

    @ApiProperty()
    filter!: string;
}
