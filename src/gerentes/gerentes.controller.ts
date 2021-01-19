import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GerentesService } from './gerentes.service';

@Controller('gerentes')
export class GerentesController {
  constructor(private gerenteService: GerentesService) {}
  @Get()
  findAllGerentes() {
    return this.gerenteService.getAll();
  }

  @Post()
  createGerente(@Body() data) {
    return this.gerenteService.create(data);
  }

  @Get(':id')
  findGerente(@Param('id') id: number) {
    return this.gerenteService.getOne(id);
  }

  @Put()
  updateGerente(@Param('id') id: number, @Body() data) {
    return this.gerenteService.update(id, data);
  }

  @Delete()
  destroyGerente(@Param('id') id: number) {
    return this.gerenteService.destroy(id);
  }
}
