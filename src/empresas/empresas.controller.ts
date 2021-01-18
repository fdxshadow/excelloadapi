import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Empresa } from './empresa.interface';
import { EmpresasService } from './empresas.service';

@Controller('empresas')
export class EmpresasController {
  constructor(private empresaService: EmpresasService) {}
  @Get()
  findAllEmpresas() {
    return this.empresaService.getAll();
  }

  @Post()
  createEmpresa(@Body() data: Empresa) {
    return this.empresaService.create(data);
  }

  @Get(':id')
  findEmpresa(@Param('id') id: number) {
    return this.empresaService.getOne(id);
  }

  @Put()
  updateEmpresa(@Param('id') id: number, @Body() data: Empresa) {
    return this.empresaService.update(id, data);
  }

  @Delete()
  destroyEmpresa(@Param('id') id: number) {
    return this.empresaService.destroy(id);
  }
}
