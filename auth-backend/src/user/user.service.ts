import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepo:Repository<User>
    ){}

    async create(data:Partial<User>){
        const user=this.userRepo.create(data);
        return await this.userRepo.save(user);
    }

    async findById(id:string){
        return await this.userRepo.findOne({
            where:{id},
            select:['id','email','role']});
    }

    async findByEmail(email:string){
        return await this.userRepo.findOne({where:{email}});
    }

    async findAll(){
        return await this.userRepo.find({
            select:['id','email','role']
        });
    }
}
