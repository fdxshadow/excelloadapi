import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SerieEntity } from './serie.entity';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(SerieEntity)
    private seriesRepository: Repository<SerieEntity>,
  ) {}

  async getAll() {
    return await this.seriesRepository.find();
  }

  async create(data) {
    const serie = this.seriesRepository.create(data);
    await this.seriesRepository.save(serie);
    return serie;
  }

  async getOne(id: number) {
    const serie = await this.seriesRepository.findOne({ id });
    if (!serie) {
      throw new HttpException('Serie no encontrada', HttpStatus.NOT_FOUND);
    }
    return serie;
  }

  async update(id: number, data) {
    const serie = await this.seriesRepository.findOne({ id });
    if (!serie) {
      throw new HttpException('Serie no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.seriesRepository.update({ id }, data);
    return this.seriesRepository.findOne({ id });
  }

  async destroy(id: number) {
    const serie = await this.seriesRepository.findOne({ id });
    if (!serie) {
      throw new HttpException('serie no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.seriesRepository.delete({ id });
    return { deleted: true };
  }
}
