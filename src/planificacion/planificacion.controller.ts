import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlanificacionService } from './planificacion.service';

@Controller('planificacion')
export class PlanificacionController {
  constructor(private planificacionService: PlanificacionService) {}
  @Post()
  @UseInterceptors(FileInterceptor('planificacion'))
  cargarPlanificacion(@UploadedFile() file, @Body() data) {
    return this.planificacionService.cargar({
      planificacion: file,
      obra: data.obra,
    });
  }

  @Get('curva_s/:id_obra')
  getCurvaS(@Param('id_obra') id_obra:number){
    return this.planificacionService.getDataCurvaS(id_obra);
  }

  @Get('eficiencia/:id_obra')
  getEficiencia(@Param('id_obra') id_obra:number){
    return this.planificacionService.getEficiencia(id_obra);
  }

  @Get('variacion/:id_obra/:sem')
  getVariacion(@Param('id_obra') id_obra:number, @Param('sem') sem:number){
    return this.planificacionService.getVariacionSup(id_obra,sem);
  }

}
