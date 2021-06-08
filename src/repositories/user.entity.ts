import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryGeneratedColumn({ name: 'user_id' })
    id!: number;

    @Column({ length: 100, nullable: true })
    @IsString()
    name!: string;

    @Column({ length: 30 })
    @IsString()
    @IsNotEmpty()
    userName!: string;

    @Column({ nullable: true })
    @IsString()
    webSite!: string;

    @Column({ nullable: true })
    @IsString()
    bio!: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    email!: string;

    @Column({ nullable: true })
    @IsString()
    password!: string;
}
