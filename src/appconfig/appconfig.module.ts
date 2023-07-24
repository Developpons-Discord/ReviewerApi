import { Module } from '@nestjs/common';
import { AuthConstants } from './auth.constants';
import { MailingConstants } from './mailing.constants';
import { BaseConstants } from './base.constants';

@Module({
  providers: [AuthConstants, MailingConstants, BaseConstants],
  exports: [AuthConstants, MailingConstants, BaseConstants],
})
export class AppconfigModule {}
