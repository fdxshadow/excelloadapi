import { IsNotEmpty, IsNumber } from 'class-validator';

export class Planificacion {
  @IsNumber()
  obra: number;
  @IsNotEmpty()
  planificacion: any;
}
