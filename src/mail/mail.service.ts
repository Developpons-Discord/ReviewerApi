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
}
