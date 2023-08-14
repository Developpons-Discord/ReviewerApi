import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailingConstants {
  constructor(private configService: ConfigService) {}

  get credentials(): SmtpCredentials {
    return {
      server: {
        host: this.configService.get<string>('MAIL_SMTP_SERVER') ?? '',
        port: this.configService.get<number>('MAIL_SMTP_PORT') ?? 0,
      },
      username: this.configService.get<string>('MAIL_USERNAME') ?? '',
      password: this.configService.get<string>('MAIL_PASSWORD') ?? '',
      from: this.configService.get<string>('MAIL_FROM') ?? '',
    };
  }
}

export declare interface SmtpCredentials {
  server: {
    host: string;
    port: number;
  };
  username: string;
  password: string;
  from: string;
}
