import {
  Body,
  Controller,
  Get,
  Post,
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
}
