import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  private role;
  constructor(role: string = null) {
    this.role = role;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tipo = request.body.tipo;
    if (tipo == this.role) {
      return true;
    }
    throw new UnauthorizedException('Acceso no permitido para este usuario');
  }
}
