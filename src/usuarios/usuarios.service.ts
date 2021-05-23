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
    let usuariosPopulate = await usuarios.map(async (usuario) => {
      let usuarioResponse = usuario.toResponseObject();
      switch (usuarioResponse.tipo) {
        case 'gerente':
          //let gerenteRelacion = await (await this.gerenteRepository.findOne({ where:{usuario:usuarioResponse}, relations:['obras']})).obra;
          let obrasEmpresa = await this.gerenteRepository.findOne({where:{usuario:usuarioResponse}, relations:['obras','obras.empresa']});
          usuarioResponse['obras'] = obrasEmpresa.obras;
          return usuarioResponse;
        case 'supervisor':
          let obras = await this.supervisorRepository.findOne({where:{usuario:usuarioResponse},relations:['obra','obra.empresa']});
          usuarioResponse['obras'] = obras.obra;
          return usuarioResponse;
        case 'administrador':
          return usuarioResponse;
      }
    });

    return Promise.all(usuariosPopulate);
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
    const { nombre, email, password, tipo, obras,area_responsable } = data;
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
          area_responsable
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

    if(usuario.tipo=='supervisor'){
      const sup = await this.supervisorRepository.findOne({where:{usuario},relations:['obra']});
      if(!sup){
        throw new BadRequestException("Informacion de usuario no encontrada");
      }
      console.log("supervisor obtenido",sup);
      const usuarioResponse = usuario.toResponseObject();
      usuarioResponse['area_responsable'] = sup.area_responsable;
      usuarioResponse['obra']=sup.obra
      return usuarioResponse;
    }
    return usuario.toResponseObject();
  }

  async deleteUsuario(id: number){
    return await this.usuarioRepository.delete({ id });
  }

  async updateUsuarioData(id:number,nombre:string,email:string,obras:any){
    const usuario = await this.usuarioRepository.findOne({ id });
    if (!usuario) {
      throw new BadRequestException('Usuario no encontrada');
    }
    usuario.nombre = nombre;
    usuario.email = email;

    await this.usuarioRepository.save(usuario);


    switch (usuario.tipo) {
      case 'supervisor':
        const obraUsuario = await this.obraRepository.findOne({ id: obras });
        const supervisor = await this.supervisorRepository.create({
          usuario,
          obra: obraUsuario,
        });
        await this.supervisorRepository.save(supervisor);
        break;
      case 'gerente':
        console.log("caimos en gerente")
        const gerente = await this.gerenteRepository.findOne({where:{usuario:usuario}});
        const obrasUpdate = await this.obraRepository.find({where:{id:In(obras)},relations:['empresa']});
        gerente.obras = obrasUpdate;
        await this.gerenteRepository.save(gerente);
        return obrasUpdate;
    }
  }
}
