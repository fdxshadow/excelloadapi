import { EmpresaEntity } from 'src/empresas/empresa.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('obras')
export class ObraEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => EmpresaEntity, (empresa) => empresa.obras)
  empresa: EmpresaEntity;
}
