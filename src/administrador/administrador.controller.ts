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
  createAdministrador(@Body() data) {
    return this.administradorService.create(data);
  }

  @Get(':id')
  findAdministrador(@Param('id') id: number) {
    return this.administradorService.getOne(id);
  }

  @Put()
  updateAdministrador(@Param('id') id: number, @Body() data) {
    return this.administradorService.update(id, data);
  }

  @Delete()
  destroyAdministrador(@Param('id') id: number) {
    return this.administradorService.destroy(id);
  }
}
