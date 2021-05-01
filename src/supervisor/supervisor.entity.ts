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
  area_responsable:string;

  @OneToOne(() => UsuarioEntity,{ onDelete: 'CASCADE' })
  @JoinColumn()
  usuario: UsuarioEntity;

  @ManyToOne(() => ObraEntity, (obra) => obra.supervisores)
  obra: ObraEntity;



}
