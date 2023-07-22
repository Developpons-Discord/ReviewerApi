import { Module } from '@nestjs/common';
import { AuthConstants } from './auth.constants';

@Module({
  providers: [AuthConstants],
  exports: [AuthConstants],
})
export class AppconfigModule {}
