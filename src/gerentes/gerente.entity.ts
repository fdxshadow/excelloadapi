import { ObraEntity } from 'src/obras/obra.entity';
import { UsuarioEntity } from 'src/usuarios/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity('gerentes')
export class GerenteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => ObraEntity,{onDelete:'CASCADE'})
  @JoinTable()
  obras: ObraEntity[];

  @OneToOne(() => UsuarioEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  usuario: UsuarioEntity;
}
