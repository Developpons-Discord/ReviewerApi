import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './auth.dto';
import { FullUser } from '../users/user.model';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{
    access_token: string;
    expires_in: number;
    user: FullUser;
  }> {
    const user = await this.usersService.findByUsername(username);

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
      roles: user.roles.map((role) => role.name),
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
      expires_in: 3600,
      user,
    };
  }

  async register({
    password: clearPassword,
    ...registerDto
  }: RegisterDto): Promise<FullUser> {
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
      accountVerification: {
        create: {
          verified: false,
          emailConfirmation: {
            create: {
              token: verificationToken,
            },
          },
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
    const user = await this.usersService.findById(Number(userId));

    if (!user) {
      throw new UnauthorizedException(
        'Votre lien de vérification ne renvoie à aucun utilisateur connu !',
      );
    }

    if (user.accountVerification?.verified) {
      throw new UnauthorizedException('Vous êtes déjà vérifié !');
    }

    if (
      !(await bcrypt.compare(
        code,
        user.accountVerification?.emailConfirmation?.token || '',
      ))
    ) {
      throw new UnauthorizedException(
        'Le code de confirmation est incorrect !',
      );
    }

    await this.usersService.verify(user.id);
  }

  async resend(userId: number) {
    const user = await this.usersService.findById(Number(userId));

    if (!user) {
      throw new UnauthorizedException(
        'Impossible de renvoyer le mail de confirmation.',
      );
    }

    if (user.accountVerification?.verified) {
      throw new UnauthorizedException('Vous êtes déjà vérifié !');
    }

    const uuid = uuidv4();
    const token = await bcrypt.hash(uuid, 10);

    try {
      await this.mailService.sendUserConfirmation(
        { ...user, password: '' },
        uuid,
      );

      await this.usersService.update({
        where: {
          id: user.id,
        },
        data: {
          accountVerification: {
            update: {
              emailConfirmation: {
                update: {
                  token,
                },
              },
            },
          },
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        "Impossible d'envoyer le mail de confirmation.",
      );
    }
  }

  async changePassword(userId: number) {
    const unencryptedToken = uuidv4();
    const verificationToken = await bcrypt.hash(unencryptedToken, 10);
    const user = await this.usersService.findById(Number(userId))

    this.usersService.update({
      where: { id: user?.id },
      data: { 
        resetPassword: {
          create: {
            emailConfirmationResetPassword: {
              create: {
                token: verificationToken
              }
            }
          }
        } 
      }
    })

    try {
      await this.mailService.sendUserChangePasswordConfirmation(
        {
          id: user?.id,
          email: user?.email
        },
        unencryptedToken,
      );
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        "Impossible d'envoyer le mail de confirmation de changement de mot de passe.",
      );
    }
  }

  async doChangePassword(userId: number, code: string, password: string) {
    const user = await this.usersService.findById(Number(userId));
    const newPassword = await bcrypt.hash(password, 10);

    if (!user) {
      throw new UnauthorizedException(
        'Votre lien de confirmation ne renvoie à aucun utilisateur connu !',
      );
    }

    if (
      !(await bcrypt.compare(
        code,
        user.resetPassword?.emailConfirmationResetPassword?.token || '',
      ))
    ) {
      throw new UnauthorizedException(
        'Le code de confirmation est incorrect !',
      );
    }

    await this.usersService.update({
      where: { username: user.username },
      data: { password: newPassword }
    })
  }
}
