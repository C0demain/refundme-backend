import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const clientType = request.headers['client-type'];
    
        // Permitir requisições sem token se vier do mobile
        if (clientType === 'mobile') {
          return true;
        }
    
        // Caso contrário, usa a autenticação padrão do Passport JWT
        return super.canActivate(context) as boolean;
      }
    
      handleRequest(err, user, info) {
        if (err || !user) {
          throw err || new UnauthorizedException('Token inválido ou ausente');
        }
        return user;
      }
}
