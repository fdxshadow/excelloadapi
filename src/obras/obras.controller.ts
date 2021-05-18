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
import { AuthGuard } from 'src/shared/auth.guard';
import { Obra } from './obra.dto';
import { ObrasService } from './obras.service';

@Controller('obras')
export class ObrasController {
  constructor(private obraService: ObrasService) {}

  @Get()
  findAllObras() {
    return this.obraService.getAll();
  }

  @Get('byEmpresa/:id_empresa')
  findObraByEmpresa(@Param('id_empresa') id: number) {
    console.log(id);
    return this.obraService.getByEmpresa(id);
  }

  @Get('byGerente/:id_gerente')
  findObraByGerente(@Param('id_gerente') id: number) {
    console.log(id);
    return this.obraService.getByGerente(id);
  }

  @Post()
  createObra(@Body() data: Obra) {
    return this.obraService.create(data);
  }

  @Get(':id')
  findObra(@Param('id') id: number) {
    return this.obraService.getOne(id);
  }

  @Put()
  updateObra(@Param('id') id: number, @Body() data) {
    return this.obraService.update(id, data);
  }

  @Delete()
  destroyObra(@Param('id') id: number) {
    return this.obraService.destroy(id);
  }

  @Get('areas/:obra_id')
  getAreasByObra(@Param('obra_id') obra_id: number){
    return this.obraService.getAreaByObra(obra_id);
  }


  @Get('estado/:id_usuario')
  getEstadoObra(@Param('id_usuario') id_usuario: number){
    return this.obraService.getEstadoObra(id_usuario);
  }
}
