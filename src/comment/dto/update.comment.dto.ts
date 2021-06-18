import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCommentDto {
    @ApiProperty()
    @IsString()
    text!: string;
}
