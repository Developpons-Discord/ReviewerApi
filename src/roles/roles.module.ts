import { Module } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Role } from './role.enum';
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
