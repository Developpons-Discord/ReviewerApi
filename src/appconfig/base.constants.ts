import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BaseConstants {
  constructor(private configService: ConfigService) {}

  get baseUrl(): string {
    return (
      this.configService.get<string>('BASE_URL') ?? 'http://localhost:3000'
    );
  }

  get frontendUrl(): string {
    return (
      this.configService.get<string>('FRONTEND_BASE_URL') ??
      'http://localhost:5173'
    );
  }
}
