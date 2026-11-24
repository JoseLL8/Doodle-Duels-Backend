import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from '../user.interface.js';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column() //todo match max length with dto limits
    nickname: string;

    @Column({ type: 'enum', default: Role.USER, enum: Role })
    role!: Role;

    @Column({ type: Boolean, default: false})
    emailVerified: boolean;

    @Column() //select:false?
    passwordHash: string; //todo make optional when adding in email verification, password is only saved after email step
}