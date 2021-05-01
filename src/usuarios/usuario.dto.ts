import { IsEmail, IsNotEmpty, isValidationOptions } from 'class-validator';

export class UsuarioLogin {
  @IsNotEmpty()
  @IsEmail(undefined,{message:"El campo email debe tener formato de email"})
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
  area_responsable:string;
}
