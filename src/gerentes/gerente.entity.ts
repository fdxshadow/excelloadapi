import { ObraEntity } from 'src/obras/obra.entity';
import { UsuarioEntity } from 'src/usuarios/usuario.entity';
import {
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('gerentes')
export class GerenteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.gerentes)
  usuario: UsuarioEntity;

  @ManyToMany(() => ObraEntity)
  @JoinTable()
  obras: ObraEntity[];
}
