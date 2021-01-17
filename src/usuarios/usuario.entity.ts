import { AdministradorEntity } from 'src/administrador/administrador.entity';
import { GerenteEntity } from 'src/gerentes/gerente.entity';
import { SerieEntity } from 'src/series/serie.entity';
import { OneToMany, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(
    () => AdministradorEntity,
    (administrador) => administrador.usuario,
  )
  administradores: AdministradorEntity[];

  @OneToMany(() => GerenteEntity, (gerente) => gerente.usuario)
  gerentes: GerenteEntity[];

  @OneToMany(() => SerieEntity, (serie) => serie.usuario)
  series: SerieEntity[];

  /*@BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }*/
}
