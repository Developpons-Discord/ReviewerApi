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
import { UserDto } from '../users/user.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto): Promise<UserDto> {
    const user = await this.authService.register(registerDto);
    return this.usersService.toDto(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('confirm')
  @Public()
  async confirm(@Query('code') code: string, @Query('userId') userId: number) {
    return this.authService.confirm(userId, code);
  }

  @Get('profile')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(Number(req.userId));
    return this.usersService.toDto(user!);
  }
}
