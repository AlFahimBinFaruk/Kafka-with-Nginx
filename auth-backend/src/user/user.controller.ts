import { Controller, UseGuards,Get, Req, ForbiddenException,Param } from '@nestjs/common';
import {UserService} from './user.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Request } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';


  
@Controller()
export class UserController {
    constructor(
        private userService:UserService
    ){}


    //this will return all user list
    //only admin can access all user list
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    @Get('admin/data')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users (Admin only)' })
    @ApiResponse({ status: 200, description: 'List of users' })
    @ApiForbiddenResponse({ description: 'Forbidden: Admins only' })
    getAllUserList(){
        return this.userService.findAll();
    }



    //only admin can access user details
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    @Get('admin/user-details/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user details by ID (Admin only)' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User details' })
    @ApiForbiddenResponse({ description: 'Forbidden: Admins only' })
    async getUserDetails(@Param('id') id:string){
        const userDetails=await this.userService.findById(id);
        if(!userDetails){
            return {'msg':'Invalid token'};
        }
        return userDetails;
    }

    //only admin and user himself can see his profile info.
    @UseGuards(JwtAuthGuard)//this will decrypt the jwt token and we will get those data in req obj.
    @Get('user/profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get own user profile' })
    @ApiResponse({ status: 200, description: 'User profile data' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized or invalid token' })
    async getUserProfile(@Req() req:Request){
        const {user} =req as any;
        const userId=user.user;
        const userDetails=await this.userService.findById(userId);
        if(!userDetails){
            return {'msg':'Invalid token'};
        }
        return userDetails;
    }
}
