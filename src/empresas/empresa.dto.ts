import { IsString } from 'class-validator';
export class Empresa {
  id: number;
  @IsString()
  nombre: string;
}
