import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { AuthConstants } from '../appconfig/auth.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private authConstants: AuthConstants,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('Veuillez préciser un token.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.authConstants.jwtSecret,
      });

      request['userId'] = payload.sub;
      request['roles'] = payload.roles;
    } catch {
      throw new UnauthorizedException('Token invalide.');
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    if (!request.cookies) {
      return undefined;
    }

    return request.cookies['access_token'];
  }
}
