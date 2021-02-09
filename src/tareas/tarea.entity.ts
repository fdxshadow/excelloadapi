import { ObraEntity } from 'src/obras/obra.entity';
import { Column, ManyToOne, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tareas')
export class TareaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  comienzo: Date;

  @Column()
  fin: Date;

  @Column()
  duracion: string;

  @Column()
  plan: string;

  @Column()
  real: string;

  @Column()
  grupo: string;

  @Column()
  area_responsable: string;

  @Column()
  bloque: string;

  @ManyToOne(() => ObraEntity, (obra) => obra.tareas)
  obra: ObraEntity;
}
