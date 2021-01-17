import { Module } from '@nestjs/common';
import { AdministradorController } from './administrador.controller';

@Module({
  controllers: [AdministradorController]
})
export class AdministradorModule {}
