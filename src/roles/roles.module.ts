import { Module } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class RolesModule {}
