import { Injectable, Controller, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string, response): Promise<any> {
    const user = await this.prisma.users.findOne({
      where: {
        email,
      },
    });
    console.log(user);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    const access_token = await this.jwtService.signAsync(payload);

    response.cookie('token', access_token, {
      httpOnly: true,
      secure: false,
    });
    return {
      payload,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.users.findOne({
      where: {
        email,
      },
    });
    if (!user) return null;
    if (user.password === password) {
      const payload = { sub: user.userId, username: user.username };
    }
  }

  async logout(response: Response) {
    response.clearCookie('token');
    return {
      message: 'success',
    };
  }
}
