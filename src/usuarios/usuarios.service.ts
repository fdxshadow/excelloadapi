import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdministradorEntity } from 'src/administrador/administrador.entity';
import { GerenteEntity } from 'src/gerentes/gerente.entity';
import { ObraEntity } from 'src/obras/obra.entity';
import { SupervisorEntity } from 'src/supervisor/supervisor.entity';
import { In, Repository } from 'typeorm';
import { UsuarioLogin, UsuarioRegistro } from './usuario.dto';
import { UsuarioEntity } from './usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private usuarioRepository: Repository<UsuarioEntity>,
    @InjectRepository(AdministradorEntity)
    private administradorRepository: Repository<AdministradorEntity>,
    @InjectRepository(GerenteEntity)
    private gerenteRepository: Repository<GerenteEntity>,
    @InjectRepository(SupervisorEntity)
    private supervisorRepository: Repository<SupervisorEntity>,
    @InjectRepository(ObraEntity)
    private obraRepository: Repository<ObraEntity>,
  ) {}

  async getAll() {
    const usuarios = await this.usuarioRepository.find();
    return usuarios.map((usuario) => usuario.toResponseObject());
  }
  async login(data: UsuarioLogin) {
    const { email, password } = data;
    const usuario = await this.usuarioRepository.findOne({ where: { email } });
    if (!usuario || !(await usuario.comparePassword(password))) {
      throw new BadRequestException('Email o contraseñas incorrectas');
    }
    return usuario.toResponseObject(true);
  }
  async register(data: UsuarioRegistro) {
    console.log('usuario solicitando registrarse', data);
    const { nombre, email, password, tipo, obras } = data;
    let usuario = await this.usuarioRepository.findOne({ where: { email } });
    if (usuario) {
      throw new BadRequestException('Usuario existente');
    }
    usuario = await this.usuarioRepository.create({ email, password, tipo,nombre });
    await this.usuarioRepository.save(usuario);
    switch (tipo) {
      case 'administrador':
        const administrador = await this.administradorRepository.create({
          usuario,
        });
        await this.administradorRepository.save(administrador);
        break;
      case 'supervisor':
        const obraUsuario = await this.obraRepository.findOne({ id: obras });
        const supervisor = await this.supervisorRepository.create({
          usuario,
          obra: obraUsuario,
        });
        await this.supervisorRepository.save(supervisor);
        break;
      case 'gerente':
        const obrasUsuario = await this.obraRepository.find({
          where: { id: In(obras) },
        });
        const gerente = await this.gerenteRepository.create({
          usuario,
          obras: obrasUsuario,
        });
        await this.gerenteRepository.save(gerente);
        break;
    }
    return usuario.toResponseObject();
  }

  async getUsuario(id: number) {
    const usuario = await this.usuarioRepository.findOne({ id });
    if (!usuario) {
      throw new BadRequestException('Usuario no encontrada');
    }
    return usuario.toResponseObject();
  }

  async deleteUsuario(id: number){
    return await this.usuarioRepository.delete({ id });
  }

  async updateUsuarioData(id:number,nombre:string,email:string){
    const usuario = await this.usuarioRepository.findOne({ id });
    if (!usuario) {
      throw new BadRequestException('Usuario no encontrada');
    }
    usuario.nombre = nombre;
    usuario.email = email;

    return await this.usuarioRepository.save(usuario);
  }
}
