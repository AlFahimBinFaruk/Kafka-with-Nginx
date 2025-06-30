import { Entity,PrimaryGeneratedColumn,Column} from "typeorm";

export type UserRole='user'|'admin';

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    username:string
    
    @Column({unique:true})
    email:string;

    @Column()
    password:string;
    
    @Column({default:'user'})
    role:UserRole;
}