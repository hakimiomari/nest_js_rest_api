import { Controller, Get, HostParam, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { AuthGuard } from './guard/auth.guard';

@Controller() // This decorator marks the class as a NestJS controller
export class AppController {
  constructor(private readonly appService: AppService) {} // Dependency injection of AppService

  @Get() // This decorator creates a GET endpoint
  @UseGuards(AuthGuard)
  getHello(): string {
    return this.appService.getHello(); // Calls the getHello method from AppService
  }
  @Get('all')
  findAll(@HostParam('subdomain') subdomain: string) {
    console.log(subdomain);
    return 'This action returns all cats';
  }

  // wildcard route
  @Get('abcd')
  wildcard(@Res() res: Response) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send({ message: 'This is a wildcard route' });
  }
}
