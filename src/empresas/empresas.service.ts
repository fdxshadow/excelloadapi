import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpresaEntity } from './empresa.entity';
import { Empresa } from './empresa.interface';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(EmpresaEntity)
    private empresaRepository: Repository<EmpresaEntity>,
  ) {}

  async getAll() {
    return await this.empresaRepository.find();
  }

  async create(data: Partial<Empresa>) {
    const empresa = this.empresaRepository.create(data);
    await this.empresaRepository.save(empresa);
    return empresa;
  }

  async getOne(id: number) {
    const empresa = await this.empresaRepository.findOne({ id });
    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }
    return empresa;
  }

  async update(id: number, data: Partial<Empresa>) {
    const empresa = await this.empresaRepository.findOne({ id });
    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.empresaRepository.update({ id }, data);
    return this.empresaRepository.findOne({ id });
  }

  async destroy(id: number) {
    const empresa = await this.empresaRepository.findOne({ id });
    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.empresaRepository.delete({ id });
    return { deleted: true };
  }
}
