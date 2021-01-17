import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasController } from './empresas.controller';

@Module({
  controllers: [EmpresasController]
})
export class EmpresasModule {}
