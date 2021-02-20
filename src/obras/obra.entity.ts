import { EmpresaEntity } from 'src/empresas/empresa.entity';
import { SupervisorEntity } from 'src/supervisor/supervisor.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('obras')
export class ObraEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => EmpresaEntity, (empresa) => empresa.obras)
  empresa: EmpresaEntity;

  @OneToMany(() => SupervisorEntity, (supervisor) => supervisor.obra)
  supervisores: ObraEntity[];
}
