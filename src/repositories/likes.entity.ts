import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'src/repositories/users.entity';
import { PhotosEntity } from 'src/repositories/photos.entity';
import { IsNumber } from 'class-validator';

@Entity({ name: 'likes' })
export class LikesEntity {
    @PrimaryGeneratedColumn({ name: 'like_id' })
    id!: number;

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
