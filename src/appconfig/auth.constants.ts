import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConstants {
  constructor(private configService: ConfigService) {}

  get jwtSecret(): string | undefined {
    return this.configService.get<string>('JWT_SECRET');
  }
}
