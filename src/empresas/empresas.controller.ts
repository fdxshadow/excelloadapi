import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { Empresa } from './empresa.dto';
import { EmpresasService } from './empresas.service';
import { ValidationPipe } from '../shared/validation.pipe';

@Controller('empresas')
export class EmpresasController {
  private logger = new Logger('EmpresasController');
  constructor(private empresaService: EmpresasService) {}
  @Get()
  findAllEmpresas() {
    return this.empresaService.getAll();
  }

  @UsePipes(new ValidationPipe())
  @Post()
  createEmpresa(@Body() data: Empresa) {
    // this.logger.log(data, 'Creacion de empresa');
    return this.empresaService.create(data);
  }

  @Get(':id')
  findEmpresa(@Param('id') id: number) {
    return this.empresaService.getOne(id);
  }
  @UsePipes(new ValidationPipe())
  @Put()
  updateEmpresa(@Param('id') id: number, @Body() data: Empresa) {
    return this.empresaService.update(id, data);
  }

  @Delete()
  destroyEmpresa(@Param('id') id: number) {
    return this.empresaService.destroy(id);
  }
}
