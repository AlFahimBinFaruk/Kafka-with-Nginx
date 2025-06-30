import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get Server Status' })
  @ApiResponse({ status: 200, description: 'Server is running!' })
  getHello(): string {
    return this.appService.getHello();
  }
}
