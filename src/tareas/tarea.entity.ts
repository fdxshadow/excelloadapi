import {PlanificacionEntity} from 'src/planificacion/planificacion.entity'
import { Column, ManyToOne, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SemanasEntity } from './semanas.entity';

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

  @ManyToOne(() => PlanificacionEntity, (planificacion) => planificacion.tareas)
  planificacion: PlanificacionEntity;

  @OneToMany(() => SemanasEntity, (semana) => semana.tarea)
  semanas: SemanasEntity[];
}
