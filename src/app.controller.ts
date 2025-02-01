import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // This decorator marks the class as a NestJS controller
export class AppController {
  constructor(private readonly appService: AppService) {} // Dependency injection of AppService

  @Get() // This decorator creates a GET endpoint
  getHello(): string {
    return this.appService.getHello(); // Calls the getHello method from AppService
  }
}