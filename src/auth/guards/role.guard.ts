import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/user/enums/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        const userRole = request.user?.role;

        if (!userRole) {
            throw new ForbiddenException('Cargo não identificado');
        }

        if (!requiredRoles.includes(userRole)) {
            throw new ForbiddenException('Acesso negado: cargo insuficiente');
        }

        return true;
    }
}
