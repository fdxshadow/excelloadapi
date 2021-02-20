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

    @ManyToOne(() => TareaEntity, (tarea) => tarea.semanas)
    tarea: TareaEntity;
}