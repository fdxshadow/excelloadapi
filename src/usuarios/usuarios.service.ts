import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdministradorEntity } from 'src/administrador/administrador.entity';
import { GerenteEntity } from 'src/gerentes/gerente.entity';
import { SerieEntity } from 'src/series/serie.entity';
import { Repository } from 'typeorm';
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
    @InjectRepository(SerieEntity)
    private serieRepository: Repository<SerieEntity>,
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
    const { nombre, email, password, tipo } = data;
    let usuario = await this.usuarioRepository.findOne({ where: { email } });
    if (usuario) {
      throw new BadRequestException('Usuario existente');
    }
    usuario = await this.usuarioRepository.create({ email, password, tipo });
    await this.usuarioRepository.save(usuario);
    switch (tipo) {
      case 'administrador':
        const administrador = await this.administradorRepository.create({
          nombre,
          usuario,
        });
        await this.administradorRepository.save(administrador);
        break;
      case 'serie':
        const serie = await this.serieRepository.create({ nombre, usuario });
        await this.serieRepository.save(serie);
        break;
      case 'gerente':
        const gerente = await this.gerenteRepository.create({
          nombre,
          usuario,
        });
        await this.gerenteRepository.save(gerente);
        break;
    }
    return usuario.toResponseObject();
  }
}
