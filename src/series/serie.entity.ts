import { ObraEntity } from 'src/obras/obra.entity';
import { TareaEntity } from 'src/tareas/tarea.entity';
import { UsuarioEntity } from 'src/usuarios/usuario.entity';
import {
  ManyToOne,
  OneToOne,
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('series')
export class SerieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.series)
  usuario: UsuarioEntity;

  @OneToOne(() => ObraEntity, (obra) => obra.id)
  obra: ObraEntity;

  @OneToMany(() => TareaEntity, (tarea) => tarea.serie)
  series: TareaEntity[];
}
