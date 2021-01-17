import { UsuarioEntity } from 'src/usuarios/usuario.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('administrador')
export class AdministradorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.administradores)
  usuario: UsuarioEntity;
}
