import { EmpresaEntity } from 'src/empresas/empresa.entity';
import { SupervisorEntity } from 'src/supervisor/supervisor.entity';
import { TareaEntity } from 'src/tareas/tarea.entity';
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

  @OneToMany(() => TareaEntity, (tarea) => tarea.obra)
  tareas: ObraEntity[];

  @OneToMany(() => SupervisorEntity, (supervisor) => supervisor.obra)
  supervisores: ObraEntity[];
}
