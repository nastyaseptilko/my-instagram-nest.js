import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber, IsString } from 'class-validator';
import { UsersEntity } from 'src/user/dal/users.entity';
import { PhotosEntity } from 'src/photo/dal/photos.entity';

@Entity({ name: 'comments' })
export class CommentsEntity {
    @PrimaryGeneratedColumn({ name: 'comment_id' })
    id!: number;

    @Column({ name: 'text' })
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

    @ManyToOne(() => PhotosEntity, photo => photo.id, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    @JoinColumn({ name: 'photo_id' })
    photo!: PhotosEntity;
}
