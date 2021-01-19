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
    const administrador = this.administradorRepository.create(data);
    await this.administradorRepository.save(administrador);
    return administrador;
  }

  async getOne(id: number) {
    const administrador = await this.administradorRepository.findOne({ id });
    if (!administrador) {
      throw new HttpException(
        'Administrador no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }
    return administrador;
  }

  async update(id: number, data) {
    const administrador = await this.administradorRepository.findOne({ id });
    if (!administrador) {
      throw new HttpException(
        'Administrador no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.administradorRepository.update({ id }, data);
    return this.administradorRepository.findOne({ id });
  }

  async destroy(id: number) {
    const administrador = await this.administradorRepository.findOne({ id });
    if (!administrador) {
      throw new HttpException(
        'Administrador no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.administradorRepository.delete({ id });
    return { deleted: true };
  }
}
