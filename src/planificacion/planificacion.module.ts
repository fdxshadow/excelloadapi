import { Module } from '@nestjs/common';
import { PlanificacionService } from './planificacion.service';
import { PlanificacionController } from './planificacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TareaEntity } from 'src/tareas/tarea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TareaEntity])],
  providers: [PlanificacionService],
  controllers: [PlanificacionController],
})
export class PlanificacionModule {}
