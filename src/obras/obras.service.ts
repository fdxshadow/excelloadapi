import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GerenteEntity } from 'src/gerentes/gerente.entity';
import { Repository } from 'typeorm';
import { ObraEntity } from './obra.entity';

@Injectable()
export class ObrasService {
  constructor(
    @InjectRepository(ObraEntity)
    private obraRepository: Repository<ObraEntity>,
    @InjectRepository(GerenteEntity)
    private gerenteRepository: Repository<GerenteEntity>,

  ) {}

  async getAll() {
    return await this.obraRepository.find({relations: ["empresa"]});
  }

  async create(data) {
    const obra = this.obraRepository.create(data);
    await this.obraRepository.save(obra);
    return obra;
  }

  async getOne(id: number) {
    const obra = await this.obraRepository.findOne({ where:{id}, relations: ['empresa']});
    if (!obra) {
      throw new HttpException('Obra no encontrada', HttpStatus.NOT_FOUND);
    }
    return obra;
  }

  async update(id: number, data) {
    const obra = await this.obraRepository.findOne({ id });
    if (!obra) {
      throw new HttpException('Obra no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.obraRepository.update({ id }, data);
    return this.obraRepository.findOne({ id });
  }

  async destroy(id: number) {
    const obra = await this.obraRepository.findOne({ id });
    if (!obra) {
      throw new HttpException('Obra no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.obraRepository.delete({ id });
    return { deleted: true };
  }

  async getByEmpresa(id_empresa: number) {
    const obras = await this.obraRepository.find({
      where: { empresa: id_empresa },
    });
    if (!obras) {
      throw new HttpException('Obra no encontrada', HttpStatus.NOT_FOUND);
    }
    return obras;
  }

  async getByGerente(id_usuario: number) {
    const gerente = await (await this.gerenteRepository.findOne({relations: ['obras'], where: {usuario:id_usuario}})).obras;
    if (!gerente) {
      throw new HttpException('Gerente no encontrado', HttpStatus.NOT_FOUND);
    }
    return gerente;
  }
}
