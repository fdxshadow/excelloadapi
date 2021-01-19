import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministradorController } from './administrador.controller';
import { AdministradorEntity } from './administrador.entity';
import { AdministradorService } from './administrador.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdministradorEntity])],
  controllers: [AdministradorController],
  providers: [AdministradorService],
})
export class AdministradorModule {}
