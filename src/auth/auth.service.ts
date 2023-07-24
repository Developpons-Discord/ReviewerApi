import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './auth.dto';
import { UserWithConfirmation, UserWithRoles } from '../users/user.model';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
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
    const unencryptedToken = uuidv4();
    const verificationToken = await bcrypt.hash(unencryptedToken, 10);

    const user = await this.usersService.create({
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
      emailConfirmation: {
        create: {
          token: verificationToken,
        },
      },
      email: registerDto.email,
      password: password,
    });

    try {
      await this.mailService.sendUserConfirmation(
        { ...user, password: '' },
        unencryptedToken,
      );
    } catch (e) {
      await this.usersService.delete(user.id);
      console.error(e);
      throw new InternalServerErrorException(
        "Impossible d'envoyer le mail de confirmation.",
      );
    }

    return user;
  }

  async confirm(userId: number, code: string) {
    const user = await this.usersService.findOne({
      where: {
        id: Number(userId),
      },
      include: {
        emailConfirmation: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Votre lien de vérification ne renvoie à aucun utilisateur connu !',
      );
    }

    if (!user.emailConfirmation) {
      throw new UnauthorizedException('Vous êtes déjà vérifié !');
    }

    if (!(await bcrypt.compare(code, user.emailConfirmation?.token || ''))) {
      throw new UnauthorizedException(
        'Le code de confirmation est incorrect !',
      );
    }

    await this.usersService.update({
      where: {
        id: Number(userId),
      },
      data: {
        emailConfirmation: {
          delete: true,
        },
      },
    });
  }
}
