import { UsuarioEntity } from 'src/usuarios/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('administrador')
export class AdministradorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UsuarioEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  usuario: UsuarioEntity;
}
