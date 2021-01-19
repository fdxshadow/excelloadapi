import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObraEntity } from './obra.entity';

@Injectable()
export class ObrasService {
  constructor(
    @InjectRepository(ObraEntity)
    private obraRepository: Repository<ObraEntity>,
  ) {}

  async getAll() {
    return await this.obraRepository.find();
  }

  async create(data) {
    const obra = this.obraRepository.create(data);
    await this.obraRepository.save(obra);
    return obra;
  }

  async getOne(id: number) {
    const obra = await this.obraRepository.findOne({ id });
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
}
