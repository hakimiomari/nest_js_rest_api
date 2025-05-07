import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

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

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async singup(data: CreateUserDto) {
    const password = await this.hashPassword(data.password);

    const isUserExist = await this.findUser(data.email);
    if (isUserExist) {
      throw new ConflictException('User already exist');
    }

    const user = await this.prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password,
      },
    });

    const { access_token, refresh_token } = await this.getTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refresh_token);
    return {
      access_token,
      refresh_token,
    };
  }

  async findUser(email: string) {
    return await this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  // update refresh token
  async updateRefreshToken(user_id: number, refresh_token: string) {
    await this.prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        refresh_token: refresh_token,
      },
    });
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
