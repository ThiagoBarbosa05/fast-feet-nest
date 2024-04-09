import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserPayload } from './jwt.strategy'
import { Roles } from './roles.decorator'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole)
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler())
    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    const user = request.user as UserPayload

    return this.matchRoles(roles, user.role)
  }
}
