import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AuthConstants } from '../appconfig/auth.constants';
import { ConfigModule } from '@nestjs/config';
import { AppconfigModule } from '../appconfig/appconfig.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AppconfigModule,
    JwtModule.registerAsync({
      imports: [AppconfigModule],
      inject: [AuthConstants],
      useFactory: async (authConstants: AuthConstants) => {
        console.log(authConstants?.jwtSecret);
        return {
          global: true,
          secret: authConstants?.jwtSecret,
          signOptions: { expiresIn: '60s' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
