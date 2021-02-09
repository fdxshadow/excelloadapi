import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupervisorEntity } from './supervisor.entity';

@Injectable()
export class SupervisorService {
  constructor(
    @InjectRepository(SupervisorEntity)
    private supervisorRepository: Repository<SupervisorEntity>,
  ) {}

  async getAll() {
    return await this.supervisorRepository.find();
  }

  async create(data) {
    const supervisor = this.supervisorRepository.create(data);
    await this.supervisorRepository.save(supervisor);
    return supervisor;
  }

  async getOne(id: number) {
    const supervisor = await this.supervisorRepository.findOne({ id });
    if (!supervisor) {
      throw new HttpException('supervisor no encontrada', HttpStatus.NOT_FOUND);
    }
    return supervisor;
  }

  async update(id: number, data) {
    const supervisor = await this.supervisorRepository.findOne({ id });
    if (!supervisor) {
      throw new HttpException('supervisor no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.supervisorRepository.update({ id }, data);
    return this.supervisorRepository.findOne({ id });
  }

  async destroy(id: number) {
    const supervisor = await this.supervisorRepository.findOne({ id });
    if (!supervisor) {
      throw new HttpException('supervisor no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.supervisorRepository.delete({ id });
    return { deleted: true };
  }
}
