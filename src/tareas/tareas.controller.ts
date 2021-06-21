import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ObrasService } from 'src/obras/obras.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { isUndefined } from 'util';
import { TareasService } from './tareas.service';

@Controller('tareas')
export class TareasController {
  constructor(private tareaService: TareasService, private obraService: ObrasService) {}

  @Get()
  findAllTareas() {
    return this.tareaService.getAll();
  }

  @Get('/obra_usuario')
  @UseGuards(new AuthGuard())
  getByObraUsuario(@Body() data){
    return this.tareaService.getByObraAssignUser(data.id_token);
  }
  

  @Post()
  createTarea(@Body() data) {
    return this.tareaService.create(data);
  }

  @Get(':id')
  findTarea(@Param('id') id: number) {
    return this.tareaService.getOne(id);
  }

  @Put()
  updateTarea(@Param('id') id: number, @Body() data) {
    return this.tareaService.update(id, data);
  }

  @Delete()
  destroyTarea(@Param('id') id: number) {
    return this.tareaService.destroy(id);
  }
  @Get('/area/:area_responsable/:sem')
  @UseGuards(new AuthGuard())
  async getTareasByArea(@Param('area_responsable') area: string,@Param('sem') semana:number, @Body() data){
    if(semana>=0){
      return this.tareaService.getTareasByArea(area,data.id_token,semana);
    }else {
      const estado = await this.obraService.getEstadoObra(data.id_token);
      return this.tareaService.getTareasByArea(area,data.id_token,estado.semanaActual);
    }
  }

  @Get('/semanas/:tarea_id')
  @UseGuards(new AuthGuard())
  getSemanasByTarea(@Param('tarea_id') tarea_id:number){
    return this.tareaService.getSemanasByTarea(tarea_id);
  }

  @Post('/semanas/')
  @UseGuards(new AuthGuard())
  updateSemana(@Body() data){
    return this.tareaService.updatePorcAvanceSem(data);
  }


  @Get('/byObra/:id_obra')
  getTareasByObra(@Param('id_obra') id_obra:number){
    return this.tareaService.getTareasByObra(id_obra);

  }

}
