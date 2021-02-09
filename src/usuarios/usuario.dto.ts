import { IsEmail, IsNotEmpty } from 'class-validator';

export class UsuarioLogin {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class UsuarioRegistro {
  @IsNotEmpty()
  nombre: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  tipo: string;
  obras: any;
}
