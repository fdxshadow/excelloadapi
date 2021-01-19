import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AdministradorService } from './administrador.service';

@Controller('administrador')
export class AdministradorController {
  constructor(private administradorService: AdministradorService) {}

  @Get()
  findAllAdministradores() {
    return this.administradorService.getAll();
  }

  @Post()
  createadministrador(@Body() data) {
    return this.administradorService.create(data);
  }

  @Get(':id')
  findadministrador(@Param('id') id: number) {
    return this.administradorService.getOne(id);
  }

  @Put()
  updateadministrador(@Param('id') id: number, @Body() data) {
    return this.administradorService.update(id, data);
  }

  @Delete()
  destroyadministrador(@Param('id') id: number) {
    return this.administradorService.destroy(id);
  }
}
