import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber, IsString } from 'class-validator';
import { UsersEntity } from 'src/repositories/users.entity';
import { PhotosEntity } from 'src/repositories/photos.entity';

@Entity({ name: 'comments' })
export class CommentsEntity {
    @PrimaryGeneratedColumn({ name: 'comment_id' })
    id!: number;

    @Column()
    @IsString()
    text!: string;

    @Column({ name: 'user_id' })
    @IsNumber()
    userId!: number;

    @Column({ name: 'photo_id' })
    @IsNumber()
    photoId!: number;

    @ManyToOne(() => UsersEntity, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user!: UsersEntity;

    @ManyToOne(() => PhotosEntity, photo => photo.id)
    @JoinColumn({ name: 'photo_id' })
    photo!: PhotosEntity;
}
