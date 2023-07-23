import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './auth.dto';
import { UserWithRoles } from '../users/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        "Nom d'utilisateur ou mot de passe incorrect.",
      );
    }

    if (!(await bcrypt.compare(pass, user.password || ''))) {
      throw new UnauthorizedException(
        "Nom d'utilisateur ou mot de passe incorrect.",
      );
    }

    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register({
    password: clearPassword,
    ...registerDto
  }: RegisterDto): Promise<Omit<UserWithRoles, 'password'>> {
    const password = await bcrypt.hash(clearPassword, 10);

    return this.usersService.create({
      username: registerDto.username,
      roles: {
        connectOrCreate: {
          where: {
            name: 'user',
          },
          create: {
            name: 'user',
          },
        },
      },
      email: registerDto.email,
      password: password,
    });
  }
}
