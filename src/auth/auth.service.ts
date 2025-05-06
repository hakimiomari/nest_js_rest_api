import { Injectable, Controller, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';

interface Tokens {
  access_token: string;
  refresh_token: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRES_IN',
          ),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRES_IN',
          ),
        },
      ),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }

  async signIn(email: string, password: string, response): Promise<any> {
    const user = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.email };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    });

    response.cookie('token', access_token, {
      httpOnly: true,
      secure: false,
    });
    return {
      payload,
    };
  }

  async refreshToken(request: Request, response: Response) {
    const refresh_token = request.cookies['refresh_token'];
    const payload = await this.jwtService.verifyAsync(refresh_token, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    });

    response.cookie('token', access_token, {
      httpOnly: true,
      secure: false,
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) return null;
    if (user.password === password) {
      const payload = { sub: user.id, username: user.email };
    }
  }

  async logout(response: Response) {
    response.clearCookie('token');
    return {
      message: 'success',
    };
  }
}
