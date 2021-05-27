import {PlanificacionEntity} from 'src/planificacion/planificacion.entity'
import { Column, ManyToOne, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SemanasEntity } from './semanas.entity';

@Entity('tareas')
export class TareaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  nombre: string;

  @Column({nullable: true})
  comienzo: Date;

  @Column({nullable: true})
  fin: Date;

  @Column({nullable: true})
  duracion: string;

  @Column({nullable: true})
  peso: string;

  @Column({nullable: true})
  trabajo:string;

  @Column({nullable: true})
  plan: string;

  @Column({nullable: true})
  real: string;

  @Column({nullable: true})
  grupo: string;

  @Column({nullable: true})
  area_responsable: string;

  @Column({nullable: true})
  bloque: string;

  @ManyToOne(() => PlanificacionEntity, (planificacion) => planificacion.tareas,{onDelete:'CASCADE'})
  planificacion: PlanificacionEntity;

  @OneToMany(() => SemanasEntity, (semana) => semana.tarea)
  semanas: SemanasEntity[];
}
