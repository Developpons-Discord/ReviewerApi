import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { BaseConstants } from '../appconfig/base.constants';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private baseConstants: BaseConstants,
  ) {}

  async sendUserConfirmation(user: User, code: string) {
    const baseUrl = this.baseConstants.frontendUrl;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Bienvenue sur Reviewer ! Confirmez votre adresse mail',
      template: './confirmation',
      context: {
        baseUrl,
        code,
        userId: user.id,
      },
    });
  }

  async sendUserChangePasswordConfirmation(userData: { id: number | undefined, email: string | undefined}, code: string) {
    const baseUrl = this.baseConstants.frontendUrl;
    await this.mailerService.sendMail({
      to: userData.email,
      subject: 'Changement de votre mot de passe',
      template: './change_password',
      context: {
        baseUrl,
        code,
        userId: userData.id,
      },
    });
  }

  /*
  / On génère un code genre un uuid v4,
  / on envoie un mail avec un lien genre /auth/password-reset?userId=...&code=... et 
  / on stocke le code en chiffré dans la db. 
  Quand l'utilisateur clique sur le lien du frontend 
    ça affiche une page avec deux champs le nv mot de passe, 
    et la route api de reset prends du json avec le nv mot de passe et en paramètre d'URL le code et le user id pour pouvoir retrouver l'utilisateur et vérifier que c'est bien sa requête 

   */
}
