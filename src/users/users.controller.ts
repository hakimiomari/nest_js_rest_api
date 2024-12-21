import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll(@Query('role') role: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    return { result: true };
  }

  @Get(':id')
  @ApiOperation({ summary: 'find specific user' })
  findOne(@Param('id') id: string) {
    return { result: true, id };
  }
}
