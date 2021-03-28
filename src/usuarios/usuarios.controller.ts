import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsuarioLogin, UsuarioRegistro } from './usuario.dto';
import { UsuariosService } from './usuarios.service';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '../shared/auth.guard';
import { Role } from '../shared/role.enum';
import { RolesGuard } from 'src/shared/roles.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}
  @Get()
  @UseGuards(new AuthGuard(), new RolesGuard(Role.Admin))
  findAllUsuarios() {
    return this.usuariosService.getAll();
  }
  @UsePipes(new ValidationPipe())
  @Post('login')
  login(@Body() data: UsuarioLogin) {
    return this.usuariosService.login(data);
  }
  @UsePipes(new ValidationPipe())
  @Post('registro')
  @UseGuards(new AuthGuard(), new RolesGuard(Role.Admin))
  register(@Body() data: UsuarioRegistro) {
    return this.usuariosService.register(data);
  }

  @Get('miUsuario')
  @UseGuards(new AuthGuard())
  getMyUsuario(@Body() data) {
    return this.usuariosService.getUsuario(data.id_token);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard(), new RolesGuard(Role.Admin))
  deleteUsuario(@Param('id') id: number){
    return this.usuariosService.deleteUsuario(id);
  }


  @Put(':id')
  @UseGuards(new AuthGuard(), new RolesGuard(Role.Admin))
  updateUsuarioData(@Param('id') id: number, @Body() data:any){
    return this.usuariosService.updateUsuarioData(id,data.nombre,data.email);
  }



}
