import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  users = [
    {
      id: 1,
      name: 'Kamranullah Hakimi',
    },
    {
      id: 2,
      name: 'Ibrahim Omari',
    },
    {
      id: 3,
      name: 'Ali Hakimi',
    },
    {
      id: 4,
      name: 'Rohanullah Omari',
    },
  ];

  @ApiTags('Get All Users')
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll(@Query('role') role: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    const usersByHighestId = [...this.users].sort((a, b) => {
      return b.id - a.id;
    });
    return { result: true, usersByHighestId, users: [...this.users] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'find specific user' })
  findOne(@Param('id') id: string) {
    return { result: true, id };
  }
}
