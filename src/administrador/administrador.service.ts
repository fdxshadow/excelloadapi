import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdministradorEntity } from './administrador.entity';

@Injectable()
export class AdministradorService {
  constructor(
    @InjectRepository(AdministradorEntity)
    private administradorRepository: Repository<AdministradorEntity>,
  ) {}

  async getAll() {
    return await this.administradorRepository.find();
  }

  async create(data) {
    const empresa = this.administradorRepository.create(data);
    await this.administradorRepository.save(empresa);
    return empresa;
  }

  async getOne(id: number) {
    const empresa = await this.administradorRepository.findOne({ id });
    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }
    return empresa;
  }

  async update(id: number, data) {
    const empresa = await this.administradorRepository.findOne({ id });
    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.administradorRepository.update({ id }, data);
    return this.administradorRepository.findOne({ id });
  }

  async destroy(id: number) {
    const empresa = await this.administradorRepository.findOne({ id });
    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.administradorRepository.delete({ id });
    return { deleted: true };
  }
}
