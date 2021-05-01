import { Module } from '@nestjs/common';
import { ObrasController } from './obras.controller';
import { ObrasService } from './obras.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObraEntity } from './obra.entity';
import { GerenteEntity } from 'src/gerentes/gerente.entity';
import { PlanificacionEntity } from 'src/planificacion/planificacion.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ObraEntity, GerenteEntity,PlanificacionEntity])],
  controllers: [ObrasController],
  providers: [ObrasService],
})
export class ObrasModule {}
