import { Module } from '@nestjs/common';
import { PlanificacionService } from './planificacion.service';
import { PlanificacionController } from './planificacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TareaEntity } from 'src/tareas/tarea.entity';
import { SemanasEntity } from 'src/tareas/semanas.entity';
import { PlanificacionEntity } from './planificacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TareaEntity,SemanasEntity, PlanificacionEntity])],
  providers: [PlanificacionService],
  controllers: [PlanificacionController],
})
export class PlanificacionModule {}
