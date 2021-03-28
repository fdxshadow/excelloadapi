import { Column, ManyToOne, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TareaEntity } from './tarea.entity';

@Entity('semanas')
export class SemanasEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    semana: number;

    @Column()
    carga_trabajo:number;

    @Column()
    trabajo_efectivo:string;

    @ManyToOne(() => TareaEntity, (tarea) => tarea.semanas)
    tarea: TareaEntity;
}