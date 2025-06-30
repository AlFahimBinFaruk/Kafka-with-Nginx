import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation,ApiCreatedResponse,ApiBadRequestResponse,ApiResponse } from '@nestjs/swagger';

@Controller()
export class AuthController {
    constructor(
        private authService:AuthService
    ){}


    // Register new user.
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiCreatedResponse({ description: 'User registered successfully' })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    register(@Body() dto:RegisterDto){
        return this.authService.register(dto);
    }


    // Login user
    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiBadRequestResponse({ description: 'Invalid credentials or input' })
    login(@Body() dto:LoginDto){
        return this.authService.login(dto);
    }
}
