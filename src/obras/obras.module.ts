import { Module } from '@nestjs/common';
import { ObrasController } from './obras.controller';
import { ObrasService } from './obras.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObraEntity } from './obra.entity';
import { GerenteEntity } from 'src/gerentes/gerente.entity';
import { PlanificacionEntity } from 'src/planificacion/planificacion.entity';
import { PlanificacionService } from 'src/planificacion/planificacion.service';
import { SupervisorEntity } from 'src/supervisor/supervisor.entity';
import { TareaEntity } from 'src/tareas/tarea.entity';
import { SemanasEntity } from 'src/tareas/semanas.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ObraEntity, GerenteEntity,SupervisorEntity,TareaEntity,SemanasEntity,PlanificacionEntity])],
  controllers: [ObrasController],
  providers: [ObrasService,PlanificacionService],
})
export class ObrasModule {}
