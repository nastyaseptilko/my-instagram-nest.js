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

    @Column({ nullable: true })
    @IsString()
    caption!: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    imagePath!: string;

    @ManyToOne(() => UsersEntity, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user!: UsersEntity;
}
