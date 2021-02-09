import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class Obra {
  id: number;
  @IsString()
  nombre: string;
  @IsNotEmpty()
  @IsNumber()
  empresa: number;
}
