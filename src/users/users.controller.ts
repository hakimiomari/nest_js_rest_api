import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../guard/auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
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

  // @Get(':id')
  // @ApiOperation({ summary: 'find specific user' })
  // findOne(@Param('id') id: string) {
  //   return { result: true, id };
  // }

  @Get('user')
  @ApiOperation({ summary: 'find specific user' })
  async getUser(@Req() request: Request) {
    console.log(AuthGuard);
    return this.usersService.getUser(request);
  }
}
