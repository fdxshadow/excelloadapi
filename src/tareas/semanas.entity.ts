import { Column, ManyToOne, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TareaEntity } from './tarea.entity';

@Entity('semanas')
export class SemanasEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    semana: number;

    @Column({nullable: true})
    carga_trabajo:number;

    @Column({nullable: true})
    trabajo_efectivo:string;

    @ManyToOne(() => TareaEntity, (tarea) => tarea.semanas, {onDelete:'CASCADE'})
    tarea: TareaEntity;
}