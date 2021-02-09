import {
  Body,
  Controller,
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
}
