import { ObraEntity } from 'src/obras/obra.entity';
import { Column, OneToMany, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('empresas')
export class EmpresaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => ObraEntity, (obra) => obra.empresa)
  obras: ObraEntity[];
}
