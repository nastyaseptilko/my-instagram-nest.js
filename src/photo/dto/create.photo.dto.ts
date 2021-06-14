import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePhotoDto {
    @ApiProperty()
    @IsString()
    caption!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    imageUrl!: string;
}
