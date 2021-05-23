import { ObraEntity } from "src/obras/obra.entity";
import { TareaEntity } from "src/tareas/tarea.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('planificacion')
export class PlanificacionEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @OneToMany(() => TareaEntity, (tarea)=> tarea.planificacion)
    tareas: TareaEntity[];

    @OneToOne(() => ObraEntity , {onDelete: 'CASCADE'})
    @JoinColumn()
    obra: ObraEntity;



}