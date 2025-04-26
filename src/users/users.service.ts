import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type User = any;
@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async findOne(email: string): Promise<User> {
    return this.prisma.users.findOne({
      where: {
        email,
      },
    });
  }

  async getUser(request) {
    const cookie = request.cookies['token'];
    const data = await this.jwtService.verifyAsync(cookie);
    return {
      data: data,
    };
  }
}
