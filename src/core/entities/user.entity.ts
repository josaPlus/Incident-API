import { Column, PrimaryGeneratedColumn } from "typeorm";


export class User{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;
}