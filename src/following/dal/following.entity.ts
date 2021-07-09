import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber } from 'class-validator';
import { UsersEntity } from '../../user/dal/users.entity';

@Entity({ name: 'following' })
export class FollowingEntity {
    @PrimaryGeneratedColumn({ name: 'follow_id' })
    id!: number;

    @Column({ name: 'subscriber_id' })
    @IsNumber()
    subscriber!: number;

    @Column({ name: 'publisher_id' })
    @IsNumber()
    publisher!: number;

    @ManyToOne(() => UsersEntity, user => user.id)
    @JoinColumn({ name: 'subscriber_id' })
    userSubscriber!: UsersEntity;

    @ManyToOne(() => UsersEntity, user => user.id)
    @JoinColumn({ name: 'publisher_id' })
    userPublisher!: UsersEntity;
}
