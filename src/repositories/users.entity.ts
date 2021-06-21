import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'users' })
export class UsersEntity {
    @PrimaryGeneratedColumn({ name: 'user_id' })
    id!: number;

    @Column({ name: 'name', length: 100, nullable: true })
    @IsString()
    name!: string;

    @Column({ name: 'user_name', length: 30 })
    @IsString()
    @IsNotEmpty()
    userName!: string;

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
