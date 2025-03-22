import { Injectable, Controller, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    return {
      payload,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(username: string, password: string) : Promise<any> {
    const user = await this.userService.findOne(username);
    if (!user) return null;
    if (user.password === password) {
      const payload = { sub: user.userId, username: user.username };
    }
  
  }
}
