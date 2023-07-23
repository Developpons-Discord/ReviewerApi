import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role, User } from '@prisma/client';
import { UserWithRoles } from '../users/user.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const { user }: { user: UserWithRoles } = context
      .switchToHttp()
      .getRequest();
    return requiredRoles.some((role) =>
      user.roles.map((r) => r.name).includes(role),
    );
  }
}
