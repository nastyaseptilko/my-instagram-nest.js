import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePhotoDto {
    @ApiProperty()
    @IsString()
    caption!: string;
}
