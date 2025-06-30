import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 
 * It’s just a TypeScript class or interface that defines the shape of the data you're expecting to receive — usually from the client (frontend).
 */
export class RegisterDto{
    
    @ApiProperty({ example: 'example', description: 'User name' })
    @IsString()
    @IsNotEmpty()
    username:string

    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    @IsEmail()
    email:string;


    @ApiProperty({ example: 'strongPassword123', description: 'User password' })
    @IsString()
    @MinLength(6)
    password:string;
}