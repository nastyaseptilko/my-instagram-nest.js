import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'users' })
export class UsersEntity {
    @PrimaryGeneratedColumn({ name: 'user_id' })
    id!: number;

    @Column({ name: 'full_name', length: 100, nullable: true })
    @IsString()
    fullName!: string;

    @Column({ name: 'nickname', length: 30 })
    @IsString()
    @IsNotEmpty()
    nickname!: string;

    @Column({ name: 'web_site', nullable: true })
    @IsString()
    webSite!: string;

    @Column({ name: 'bio', nullable: true })
    @IsString()
    bio!: string;

    @Column({ name: 'email' })
    @IsString()
    @IsNotEmpty()
    email!: string;

    @Column({ name: 'password', nullable: true })
    @IsString()
    password!: string;
}
