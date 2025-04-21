import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, any>,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { username, password } = signInDto;
    return this.authService.signIn(username, password, response);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile() {
    return 'profile';
  }
  // @UseGuards(AuthGuard)
  // @Get('logout')
  // async logout(@Request() req) {
  //   return req.logout();
  // }
  @UseGuards(AuthGuard)
  @Get('user')
  async getUser(@Req() request: Request) {
    console.log('request.cookie => ', request.cookies['token']);
    return request.cookies['token'];
    // this.authService.getUser(request);
  }
}
