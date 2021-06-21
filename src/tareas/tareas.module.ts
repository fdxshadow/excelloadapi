import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GerenteEntity } from 'src/gerentes/gerente.entity';
import { ObraEntity } from 'src/obras/obra.entity';
import { ObrasService } from 'src/obras/obras.service';
import { PlanificacionEntity } from 'src/planificacion/planificacion.entity';
import { PlanificacionService } from 'src/planificacion/planificacion.service';
import { SupervisorEntity } from 'src/supervisor/supervisor.entity';
import { SemanasEntity } from './semanas.entity';
import { TareaEntity } from './tarea.entity';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';

@Module({
  imports: [TypeOrmModule.forFeature([TareaEntity,SemanasEntity,ObraEntity, GerenteEntity,SupervisorEntity,PlanificacionEntity])],
  controllers: [TareasController],
  providers: [TareasService,ObrasService, PlanificacionService],
})
export class TareasModule {}
