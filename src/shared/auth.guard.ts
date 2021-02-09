import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  private request;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.request = context.switchToHttp().getRequest();
    //return validateRequest(request);
    if (!this.request.headers.authorization) {
      return false;
    }
    await this.validateToken(this.request.headers.authorization);
    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new ForbiddenException('Token invalido');
    }
    const token = auth.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      this.request.body['tipo_token'] = decoded['tipo'];
      this.request.body['id_token'] = decoded['id'];
      console.log('Decoded token', decoded);
      return decoded;
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name);
      throw new ForbiddenException(message);
    }
  }
}
