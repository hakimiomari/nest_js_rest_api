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
import { CreateUserDto } from './dto/user.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() data, @Res({ passthrough: true }) response: Response) {
    const { email, password } = data;
    return this.authService.signIn(email, password, response);
  }

  @Post('signup')
  async singup(@Body() dto: CreateUserDto) {
    return this.authService.singup(dto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile() {
    return 'profile';
  }

  @Post('refresh_token')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshToken(request, response);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
