import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UsersEntity } from 'src/repositories/users.entity';

@Entity({ name: 'photos' })
export class PhotosEntity {
    @PrimaryGeneratedColumn({ name: 'photo_id' })
    id!: number;

    @Column({ name: 'user_id' })
    @IsNumber()
    userId!: number;

    @Column({ name: 'caption', nullable: true })
    @IsString()
    caption!: string;

    @Column({ name: 'image_url' })
    @IsNotEmpty()
    @IsString()
    imageUrl!: string;

    @Column({ name: 'filter', nullable: true })
    @IsString()
    filter!: string;

    @ManyToOne(() => UsersEntity, user => user.id, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    @JoinColumn({ name: 'user_id' })
    user!: UsersEntity;
}
