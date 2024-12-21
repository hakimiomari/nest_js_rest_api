import { Controller, Get, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll(@Query('role') role: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    return { result: true };
  }
}
