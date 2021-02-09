import { ObraEntity } from 'src/obras/obra.entity';
import { UsuarioEntity } from 'src/usuarios/usuario.entity';
import {
  OneToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('supervisor')
export class SupervisorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToOne(() => UsuarioEntity)
  @JoinColumn()
  usuario: UsuarioEntity;

  @ManyToOne(() => ObraEntity, (obra) => obra.supervisores)
  obra: ObraEntity;
}
