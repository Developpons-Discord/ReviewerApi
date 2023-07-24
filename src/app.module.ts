import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AppconfigModule } from './appconfig/appconfig.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [AuthModule, UsersModule, RolesModule, AppconfigModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
