import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { AppconfigModule } from '../appconfig/appconfig.module';
import { MailingConstants } from '../appconfig/mailing.constants';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    AppconfigModule,
    MailerModule.forRootAsync({
      imports: [AppconfigModule],
      inject: [MailingConstants],
      useFactory: async (
        mailingConstants: MailingConstants,
      ): Promise<MailerOptions> => {
        console.log(mailingConstants.credentials);

        return {
          transport: {
            host: mailingConstants?.credentials?.server?.host,
            port: mailingConstants?.credentials?.server?.port,
            auth: {
              user: mailingConstants?.credentials?.username,
              pass: mailingConstants?.credentials?.password,
            },
          },
          defaults: {
            from: mailingConstants?.credentials?.from,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
