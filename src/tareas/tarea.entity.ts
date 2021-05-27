import {PlanificacionEntity} from 'src/planificacion/planificacion.entity'
import { Column, ManyToOne, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SemanasEntity } from './semanas.entity';

@Entity('tareas')
export class TareaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true, default: ''})
  nombre: string;

  @Column({nullable: true, default: ''})
  comienzo: Date;

  @Column({nullable: true, default: ''})
  fin: Date;

  @Column({nullable: true, default: ''})
  duracion: string;

  @Column({nullable: true, default: ''})
  peso: string;

  @Column({nullable: true, default: ''})
  trabajo:string;

  @Column({nullable: true, default: ''})
  plan: string;

  @Column({nullable: true, default: ''})
  real: string;

  @Column({nullable: true, default: ''})
  grupo: string;

  @Column({nullable: true, default: ''})
  area_responsable: string;

  @Column({nullable: true, default: ''})
  bloque: string;

  @ManyToOne(() => PlanificacionEntity, (planificacion) => planificacion.tareas,{onDelete:'CASCADE'})
  planificacion: PlanificacionEntity;

  @OneToMany(() => SemanasEntity, (semana) => semana.tarea)
  semanas: SemanasEntity[];
}
