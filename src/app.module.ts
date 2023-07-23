import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AppconfigModule } from './appconfig/appconfig.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [AuthModule, UsersModule, RolesModule, AppconfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
