import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TareasService } from './tareas.service';

@Controller('tareas')
export class TareasController {
  constructor(private tareaService: TareasService) {}

  @Get()
  findAllTareas() {
    return this.tareaService.getAll();
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
}
