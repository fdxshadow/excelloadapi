import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TareaEntity } from './tarea.entity';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(TareaEntity)
    private tareasRepository: Repository<TareaEntity>,
  ) {}

  async getAll() {
    return await this.tareasRepository.find();
  }

  async create(data) {
    const tarea = this.tareasRepository.create(data);
    await this.tareasRepository.save(tarea);
    return tarea;
  }

  async getOne(id: number) {
    const tarea = await this.tareasRepository.findOne({ id });
    if (!tarea) {
      throw new HttpException('Tarea no encontrada', HttpStatus.NOT_FOUND);
    }
    return tarea;
  }

  async update(id: number, data) {
    const tarea = await this.tareasRepository.findOne({ id });
    if (!tarea) {
      throw new HttpException('Tarea no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.tareasRepository.update({ id }, data);
    return this.tareasRepository.findOne({ id });
  }

  async destroy(id: number) {
    const tarea = await this.tareasRepository.findOne({ id });
    if (!tarea) {
      throw new HttpException('Tarea no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.tareasRepository.delete({ id });
    return { deleted: true };
  }
}
