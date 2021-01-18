import { ObraEntity } from 'src/obras/obra.entity';

export interface Empresa {
  id: number;
  nombre: string;
  obras: ObraEntity[];
}
