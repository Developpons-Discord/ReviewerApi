import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { RegisterDto } from './auth.dto';
import { UserWithRoles } from '../users/user.model';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @Public()
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<Omit<UserWithRoles, 'password'>> {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('confirm')
  @Public()
  async confirm(@Query('code') code: string, @Query('userId') userId: number) {
    return this.authService.confirm(userId, code);
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
