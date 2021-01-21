import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministradorEntity } from 'src/administrador/administrador.entity';
import { GerenteEntity } from 'src/gerentes/gerente.entity';
import { SerieEntity } from 'src/series/serie.entity';
import { UsuarioEntity } from './usuario.entity';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsuarioEntity,
      AdministradorEntity,
      GerenteEntity,
      SerieEntity,
    ]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
