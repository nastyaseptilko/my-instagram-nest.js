import { ApiProperty } from '@nestjs/swagger';

export class CreatePhotoDto {
    @ApiProperty()
    caption!: string;

    @ApiProperty()
    filter!: string;
}
