import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TareaEntity } from './tarea.entity';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';

@Module({
  imports: [TypeOrmModule.forFeature([TareaEntity])],
  controllers: [TareasController],
  providers: [TareasService],
})
export class TareasModule {}
