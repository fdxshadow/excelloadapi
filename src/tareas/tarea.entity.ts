import {PlanificacionEntity} from 'src/planificacion/planificacion.entity'
import { Column, ManyToOne, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SemanasEntity } from './semanas.entity';

@Entity('tareas')
export class TareaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true, default: null})
  nombre: string;

  @Column({nullable: true, default: null})
  comienzo: Date;

  @Column({nullable: true, default: null})
  fin: Date;

  @Column({nullable: true, default: null})
  duracion: string;

  @Column({nullable: true, default: null})
  peso: string;

  @Column({nullable: true, default: null})
  trabajo:string;

  @Column({nullable: true, default: null})
  plan: string;

  @Column({nullable: true, default: null})
  real: string;

  @Column({nullable: true, default: null})
  grupo: string;

  @Column({nullable: true, default: null})
  area_responsable: string;

  @Column({nullable: true, default: null})
  bloque: string;

  @Column({default:false})
  isResumen: boolean

  @Column({nullable:true})
  idResumenPadre:number

  @ManyToOne(() => PlanificacionEntity, (planificacion) => planificacion.tareas,{onDelete:'CASCADE'})
  planificacion: PlanificacionEntity;

  @OneToMany(() => SemanasEntity, (semana) => semana.tarea)
  semanas: SemanasEntity[];
}
