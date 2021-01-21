import { SerieEntity } from 'src/series/serie.entity';
import { Column, ManyToOne, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tareas')
export class TareaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  fecha_inicio: Date;

  @ManyToOne(() => SerieEntity, (serie) => serie.tarea)
  series: SerieEntity;
}
