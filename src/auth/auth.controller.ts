import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import {ChangePasswordDto, ChangePasswordProcessDto, RegisterDto} from './auth.dto';
import { UserDto } from '../users/user.dto';
import { UsersService } from '../users/users.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  async signIn(
    @Body() signInDto: Record<string, any>,
    @Res({ passthrough: true }) response: Response,
  ) {
    const signInResult = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );

    response.cookie('access_token', signInResult.access_token, {
      expires: new Date(Date.now() + signInResult.expires_in * 1000),
    });

    return this.usersService.toDto(signInResult.user);
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

  @HttpCode(HttpStatus.OK)
  @Post('resend')
  async resend(@Request() req: any) {
    return this.authService.resend(req.userId);
  }

  @Get('profile')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(Number(req.userId));
    return this.usersService.toDto(user!);
  }

  @HttpCode(HttpStatus.OK)  // maybe change that
  @Post('change-password')
  @Public()
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findByEmail(changePasswordDto.email)
    return this.authService.changePassword(Number(user?.id))
  }

  @HttpCode(HttpStatus.OK)
  @Post('change-password-process')
  @Public()
  async changePasswordProcess(
    @Query('code') code: string,
    @Query('userId') userId: number,
    @Body() changePasswordProcessDto: ChangePasswordProcessDto
  ) {
    return this.authService.doChangePassword(userId, code, changePasswordProcessDto.newPassword)
  }
}
