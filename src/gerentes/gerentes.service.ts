import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GerenteEntity } from './gerente.entity';

@Injectable()
export class GerentesService {
  constructor(
    @InjectRepository(GerenteEntity)
    private gerenteRepository: Repository<GerenteEntity>,
  ) {}

  async getAll() {
    return await this.gerenteRepository.find();
  }

  async create(data) {
    const empresa = this.gerenteRepository.create(data);
    await this.gerenteRepository.save(empresa);
    return empresa;
  }

  async getOne(id: number) {
    const gerente = await this.gerenteRepository.findOne({ id });
    if (!gerente) {
      throw new HttpException('Gerente no encontrado', HttpStatus.NOT_FOUND);
    }
    return gerente;
  }

  async update(id: number, data) {
    const gerente = await this.gerenteRepository.findOne({ id });
    if (!gerente) {
      throw new HttpException('Gerente no encontrado', HttpStatus.NOT_FOUND);
    }
    await this.gerenteRepository.update({ id }, data);
    return this.gerenteRepository.findOne({ id });
  }

  async destroy(id: number) {
    const gerente = await this.gerenteRepository.findOne({ id });
    if (!gerente) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.gerenteRepository.delete({ id });
    return { deleted: true };
  }
}
