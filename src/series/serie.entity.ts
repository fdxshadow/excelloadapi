import { ObraEntity } from 'src/obras/obra.entity';
import { TareaEntity } from 'src/tareas/tarea.entity';
import { UsuarioEntity } from 'src/usuarios/usuario.entity';
import {
  OneToOne,
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
} from 'typeorm';

@Entity('series')
export class SerieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToOne(() => ObraEntity, (obra) => obra.id)
  obra: ObraEntity;

  @OneToMany(() => TareaEntity, (tarea) => tarea.series)
  tarea: TareaEntity[];

  @OneToOne(() => UsuarioEntity)
  @JoinColumn()
  usuario: UsuarioEntity;
}
